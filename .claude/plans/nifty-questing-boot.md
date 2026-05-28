# Fix Referral Package Leakage via Account Deletion/Recreation

## Context

A business logic vulnerability allows users to repeatedly claim referral rewards by deleting and recreating accounts with the same phone number. The root cause is that the system uses soft-deletion (`status=2`) and the `User.default_scope` (`where.not(status: STATUS_ENUM[:deleted])`) hides deleted users from all normal queries. When a new account is created with a previously-deleted phone number, there's no check preventing the same referral code from being applied again, resulting in duplicate referral credit issuance.

## Changes

### 1. `app/models/user.rb` — Guard the reward issuance callback

**File:** `app/models/user.rb`
**Method:** `allot_signup_referral_reward` (line 3188)

Add a check using `User.unscoped` to verify that no account (active or deleted) with the same `phone` + `country_code` has already claimed a referral reward. This is the single choke point for all referral reward issuance.

**Change:**
```ruby
def allot_signup_referral_reward
  referrer = User.find_by(ref_code: referrer_code)
  return if referrer.nil? || skip_signup_referrer_reward?(referrer)
  # Prevent referral leakage: check if this phone number already claimed a referral (including deleted accounts)
  return if User.unscoped.where(phone: phone, country_code: country_code)
                     .where.not(referrer_code: nil)
                     .where.not(id: id)
                     .exists?
  Referral.allot_credits_after_sign_up(referrer, self)
end
```

### 2. `app/services/v4/users/login_user_service.rb` — Validate at signup time

**File:** `app/services/v4/users/login_user_service.rb`
**Method:** `check_referal_and_validate` (line 162)

Add the same check to prevent the referral code from being applied during signup in the first place, rather than only blocking the reward.

**Change:**
```ruby
def check_referal_and_validate(referral_code, user)
  return false if referral_code.blank?
  referrer = User.find_by(ref_code: referral_code)
  return false if referrer.blank?
  return false if referrer.email == user.email
  # Prevent referral leakage: don't allow re-referral of same phone number
  return false if User.unscoped.where(phone: user.phone, country_code: user.country_code)
                              .where.not(referrer_code: nil)
                              .exists?
  return true
end
```

## Verification

1. **Unit/integration test (manual verification steps):**
   - Create User A (phone: 9999999999) using User B's referral code → verify referral credits issued to User B
   - Soft-delete User A (set status=2)
   - Create a new User A' with the same phone number (9999999999), again using User B's referral code
   - **Expected:** The referral code should NOT be applied. No credits should be issued to User B.
   - Verify via Rails console: `User.unscoped.where(phone: '9999999999', country_code: '+91').where.not(referrer_code: nil).exists?` should return true (the original User A's referrer_code still exists)

2. **Edge case - legitimate new user with recycled number:**
   - A genuinely new person gets a recycled phone number that was previously used for a referral
   - They will not be able to use a referral code (acceptable trade-off vs. abuse)

3. **Edge case - phone number change before deletion:**
   - If the phone number was changed before deletion, the check passes correctly (old phone ≠ new phone)
