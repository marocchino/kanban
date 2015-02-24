require "test_helper"

class Api::IssuesControllerTest < ActionController::TestCase
  def test_index
    get :index
    hash = JSON.parse(response.body)
    assert_kind_of Array, hash["issues"]
    assert_response :success
  end

  def test_update_change_status
    issue = issues(:one)
    put :update, id: issue.id, issue: {status: "done"}
    issue.reload
    assert_equal issue.status, "done"
    assert_response :success
  end
end
