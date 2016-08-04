# frozen_string_literal: true
ENV['RAILS_ENV'] = 'test'
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'
require 'minitest/rails'

module ActiveSupport
  class TestCase
    ActiveRecord::Migration.check_pending!

    fixtures :all
  end
end
