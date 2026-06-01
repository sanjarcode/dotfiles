def redis_reverse_search(query)
  matches = I18N_REDIS.keys("en.*").select do |k|
    I18N_REDIS.get(k)&.downcase&.include?(query.downcase)
  end

  matches.each { |k| puts "#{k}: #{I18N_REDIS.get(k)}" }
  matches.size
end
