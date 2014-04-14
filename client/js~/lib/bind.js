Function.prototype.bind = Function.prototype.bind || function(fixThis) {
  var func = this  
  return function() {
    return func.apply(fixThis, arguments)
  }
}