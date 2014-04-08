//usage: {{> dynamicTemplate name="templateName" data=dataContext}}
Template.dynamicTemplate.chooseTemplate = function(name) {
  return Template[name];
};