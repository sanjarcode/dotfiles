def redis_reverse_search(query)
  I18N_REDIS.keys("en.*").each do |k|
    v = I18N_REDIS.get(k)
    puts "#{k}: #{v}" if v&.downcase&.include?(query.downcase)
  end
end

