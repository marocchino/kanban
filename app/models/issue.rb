class Issue < ActiveRecord::Base
  enum status: %i(todo doing done)
  validates :priority, uniqueness: { scope: :status }
end
