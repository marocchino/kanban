class Rotator
  attr_reader :current, :target, :placement
  def initialize(current, target, placement)
    @current = current.to_i
    @target = target.to_i
    @placement = placement
  end

  def array
    if @issues.blank?
      range.to_a
    else
      @issues.map(&:priority)
    end
  end

  def rotate
    if full?
      array.rotate(rotate_number)
    elsif current > target
      [target] + array[1, array.size - 1].rotate(rotate_number)
    elsif target > current
      array[0, array.size - 1].rotate(rotate_number) + [target]
    end
  end

  def issues(status=nil)
    @issues ||= status.nil? ? [] : Issue.status(status).where(priority: range).order(priority: :asc).all
  end

  def save
    @issues.zip(rotate).all? do |issue, priority|
      issue.update_attribute(:priority, priority)
    end
  end

  private

  def range
    current > target ? target..current : current..target
  end

  def full?
    (current > target) && placement == "before" ||
      (target > current) && placement == "after"
  end

  def rotate_number
    (current > target) ? 1 : -1
  end
end
