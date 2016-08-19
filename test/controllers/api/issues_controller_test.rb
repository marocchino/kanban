# frozen_string_literal: true
require 'test_helper'

module Api
  class IssuesControllerTest < ActionDispatch::IntegrationTest
    def test_index
      get '/api/issues'
      hash = JSON.parse(response.body)
      assert_kind_of Array, hash['data']
      assert_response :success
    end

    def test_update_without_target
      issue = issues(:one)
      put "/api/issues/#{issue.id}", params: { status: 'done' }
      issue.reload
      assert_equal 'done', issue.status
      assert_response :success
    end

    def test_update_with_target
      issue = issues(:one)
      put "/api/issues/#{issue.id}",
          params: { status: 'done', target_priority: '1', placement: 'after' }
      issue.reload
      assert_equal 'done', issue.status
      assert_response :success
    end
  end
end
