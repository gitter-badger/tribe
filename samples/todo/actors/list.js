require('tribe').register.actor(function (actor) {
  var self = this;

  actor.isDistributed();
  actor.isScopedTo('userId');

  actor.handles = {
    'todo.add': function (data) {
      self.todos.push(data);
    }
  }

  this.todos = ko.observableArray();
})
