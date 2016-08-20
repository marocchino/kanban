# frozen_string_literal: true
require 'test_helper'

class IssuesControllerTest < ActionDispatch::IntegrationTest
  def test_index
    get '/'
    assert_response :success
  end
end
