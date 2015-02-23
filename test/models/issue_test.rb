require "test_helper"

class IssueTest < ActiveSupport::TestCase

  def issue
    @issue ||= Issue.new
  end

  def test_valid
    assert issue.valid?
  end
end
