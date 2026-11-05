#!/usr/bin/env ruby
# encoding: UTF-8
# destinations.yml の必須フィールド・型・整合性をチェックするバリデーションスクリプト。
# 新しい島の記事を追加した後や、価格を更新した後に実行する。
# 使い方: ruby scripts/validate_destinations.rb [path]（省略時は _data/destinations.yml）
require 'yaml'

REQUIRED_STRING_FIELDS = %w[name en_name slug country country_slug description flight_hours recommended_nights visa photo url]
REQUIRED_PRESENT_FIELDS = %w[photo_credit_url] # 値は空文字 "" でもよいが、キー自体は必須
REQUIRED_NUMERIC_FIELDS = %w[lat lng flight_min flight_max flight_min_kansai flight_max_kansai hotel_min hotel_max transport_min transport_max food_min food_max]
REQUIRED_ARRAY_FIELDS = %w[suited_for best_months]
BUDGET_TAG_KEYS = %w[yasu yuru ragu]
TAG_SCORE_KEYS = %w[beach resort island city_base sightseeing relax party activity]

path = ARGV[0] || '_data/destinations.yml'
data = YAML.load_file(path)

errors = []
seen_slugs = {}

data.each_with_index do |entry, i|
  label = entry['slug'] || entry['name'] || "entry ##{i}"

  (REQUIRED_STRING_FIELDS + REQUIRED_PRESENT_FIELDS).each do |f|
    errors << "#{label}: missing field '#{f}'" unless entry.key?(f)
  end
  REQUIRED_STRING_FIELDS.each do |f|
    if entry.key?(f) && (entry[f].nil? || entry[f].to_s.strip.empty?)
      errors << "#{label}: field '#{f}' is empty"
    end
  end
  REQUIRED_NUMERIC_FIELDS.each do |f|
    if !entry.key?(f)
      errors << "#{label}: missing numeric field '#{f}'"
    elsif !entry[f].is_a?(Numeric)
      errors << "#{label}: field '#{f}' is not numeric (#{entry[f].inspect})"
    end
  end
  REQUIRED_ARRAY_FIELDS.each do |f|
    if !entry.key?(f)
      errors << "#{label}: missing array field '#{f}'"
    elsif !entry[f].is_a?(Array) || entry[f].empty?
      errors << "#{label}: field '#{f}' must be a non-empty array"
    end
  end

  if entry['budget_tags'].is_a?(Hash)
    BUDGET_TAG_KEYS.each do |k|
      unless entry['budget_tags'][k].is_a?(Array) && !entry['budget_tags'][k].empty?
        errors << "#{label}: budget_tags.#{k} must be a non-empty array"
      end
    end
  else
    errors << "#{label}: missing budget_tags hash"
  end

  if entry['tags'].is_a?(Hash)
    TAG_SCORE_KEYS.each do |k|
      errors << "#{label}: tags.#{k} missing" unless entry['tags'].key?(k)
    end
  else
    errors << "#{label}: missing tags hash"
  end

  if entry['flight_min'].is_a?(Numeric) && entry['flight_max'].is_a?(Numeric) && entry['flight_min'] > entry['flight_max']
    errors << "#{label}: flight_min > flight_max"
  end
  if entry['flight_min_kansai'].is_a?(Numeric) && entry['flight_max_kansai'].is_a?(Numeric) && entry['flight_min_kansai'] > entry['flight_max_kansai']
    errors << "#{label}: flight_min_kansai > flight_max_kansai"
  end
  if entry['flight_min'] && entry['flight_min_kansai'] && entry['flight_max'] && entry['flight_max_kansai'] &&
     entry['flight_min'] == entry['flight_min_kansai'] && entry['flight_max'] == entry['flight_max_kansai']
    errors << "#{label}: flight_min_kansai/flight_max_kansai is identical to Tokyo values (likely unresearched placeholder)"
  end

  if entry['slug']
    errors << "duplicate slug: #{entry['slug']}" if seen_slugs[entry['slug']]
    seen_slugs[entry['slug']] = true
  end
end

if errors.empty?
  puts "OK: #{data.size} entries, no issues found."
  exit 0
else
  puts "#{errors.size} issue(s) found in #{data.size} entries:"
  errors.each { |e| puts "  - #{e}" }
  exit 1
end
