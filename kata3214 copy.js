const debounce = (fn, debounceTime) => {
    let timer
return function(){
    const fnCall = () => {fn.apply(this,arguments)}
clearTimeout(timer)
timer = setTimeout(fnCall,debounceTime)
}
};