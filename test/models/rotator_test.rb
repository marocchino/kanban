require "test_helper"

class RotatorTest < ActiveSupport::TestCase
  def rotate(current, target, placement)
    Rotator.new(current, target, placement).rotate
  end

  def test_rotate_full
    assert_equal [4, 1, 2, 3], rotate(1, 4, "after")
    assert_equal [3, 1, 2], rotate(1, 3, "after")
    assert_equal [2, 1], rotate(1, 2, "after")
    assert_equal [2, 3, 4, 1], rotate(4, 1, "before")
    assert_equal [2, 3, 1], rotate(3, 1, "before")
    assert_equal [2, 1], rotate(2, 1, "before")
  end

  def test_rotate_remain_one
    assert_equal [3, 1, 2, 4], rotate(1, 4, "before")
    assert_equal [1, 3, 4, 2], rotate(4, 1, "after")
    assert_equal [2, 1, 3], rotate(1, 3, "before")
    assert_equal [1, 3, 2], rotate(3, 1, "after")
  end

end
