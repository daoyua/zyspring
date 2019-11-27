var els=document.querySelectorAll('.scrollToTop');
Array.prototype.forEach.call(els, function(el, i){
	el.addEventListener('click', function(){
		target=el.dataset.target;
		document.getElementById(target).scrollIntoView({
		  behavior: 'smooth'
		});
	});
});
