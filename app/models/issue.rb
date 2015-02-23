class Issue < ActiveRecord::Base
  enum status: %i(todo doing done)
end
