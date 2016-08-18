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

    def test_update
      issue = issues(:one)
      patch :update, id: issue.id, issue: { status: 'done' }
      issue.reload
      assert_equal issue.status, 'done'
      assert_response :success
    end
  end
end
