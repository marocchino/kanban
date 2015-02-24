class Rotator
  attr_reader :current, :target, :placement
  def initialize(current, target, placement)
    @current = current.to_i
    @target = target.to_i
    @placement = placement
  end

  def array
    current > target ? [*target..current] : [*current..target]
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

  private

  def full?
    (current > target) && placement == "before" ||
      (target > current) && placement == "after"
  end

  def rotate_number
    (current > target) ? -1 : 1
  end
end
