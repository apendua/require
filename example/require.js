if (Meteor.isClient) {

  var messages = new Meteor.Collection(null);
  var next = 0;

  var log = function (msg) {
    messages.insert({ text: msg, index: next++ });
  };

  define('module2', function () {
    log('creating module2');
    return 'module2';
  });

  define('module3', ['module1', 'module2'], function () {
    log('creating module3');
    return 'module3';
  });

  define('module1', function () {
    log('creating module1');
    return 'module1';
  });

  log('require module3');

  require('module3', function () {
    log('module3 loaded ...');
  });

  Template.listOfMessages.helpers({
    messages: function () {
      return messages.find({}, {sort: {index:1}});
    },
  });

}
