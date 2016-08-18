# frozen_string_literal: true
require 'test_helper'

module Api
  class IssuesControllerTest < ActionController::TestCase
    def test_index
      get :index
      hash = JSON.parse(response.body)
      assert_kind_of Array, hash['data']
      assert_response :success
    end

    def test_update_without_target
      issue = issues(:one)
      put :update, id: issue.id, status: 'done'
      issue.reload
      assert_equal 'done', issue.status
      assert_response :success
    end

    def test_update_with_target
      issue = issues(:one)
      put :update,
          id: issue.id,
          status: 'done',
          target_priority: '1',
          placement: 'after'
      issue.reload
      assert_equal 'done', issue.status
      assert_response :success
    end
  end
end
