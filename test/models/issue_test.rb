require "test_helper"

class IssueTest < ActiveSupport::TestCase

  def issue
    @issue ||= Issue.new
  end

  def test_valid
    assert issue.valid?
  end

  def test_todo_status
    assert issue.todo?
    assert_equal "todo", issue.status
  end

  def test_doing_status
    issue = issues(:two)
    assert issue.doing?
    assert_equal "doing", issue.status
  end

  def test_done_status
    issue = issues(:three)
    assert issue.done?
    assert_equal "done", issue.status
  end
end
