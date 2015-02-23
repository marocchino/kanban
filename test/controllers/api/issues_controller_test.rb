require "test_helper"

class Api::IssuesControllerTest < ActionController::TestCase
  def test_index
    get :index
    hash = JSON.parse(response.body)
    assert_kind_of Array, hash["issues"]
    assert_response :success
  end
end
