const mobileQuery = matchMedia("screen and (max-width:980px)")
const main = document.querySelector("main");
const htmlElement = document.documentElement;
const indicator = document.querySelector('#indicator');
const sections = document.querySelectorAll("section");
let arrowKeyPressed = false;
main.addEventListener('scroll',(evt)=>{
  if(evt.isTrusted){
    arrowKeyPressed = true;
  }
})
sections.forEach((sect,index)=>{
  if(!/Android/.test(navigator.userAgent)){
    sect.tabIndex = 0;
  }
  const scrollObserver = new IntersectionObserver((irs)=>{
    irs.forEach(ir=>{
      if(ir.intersectionRatio == 1){
        ir.target.classList.add("current-page");
        ir.target.removeAttribute('inert');
        updateIndicator( [...sections].indexOf(ir.target) );
        if(arrowKeyPressed) {
          let timeout = setTimeout(()=>{
            clearTimeout(timeout)
            ir.target.focus();
            arrowKeyPressed = false;
          },50)
        }
      } else {
        ir.target.setAttribute('inert',"");
        ir.target.classList.remove("current-page");
        if(ir.target.classList.length == 0 ){
          ir.target.removeAttribute('class');
        }
      }
    });
  },{
    threshold:[1.0],
    root:main
  });
  scrollObserver.observe(sect);
});


document.querySelectorAll("#scroll-controller button").forEach(button=>{
  button.addEventListener('click',()=>{
    const currentPage = document.querySelector('.current-page');
    switch(button.id) {
      case "previous":
        if ([...sections].indexOf(currentPage)-1 == 0) {
          document.querySelector("#next").focus();
        }
        currentPage.previousElementSibling?.scrollIntoView({block:"start"});
        break;
      case "next":
        if([...sections].indexOf(currentPage)+1 == sections.length-1) {
          document.querySelector("#previous").focus();
        }
        currentPage?.nextElementSibling?.scrollIntoView({blcok:"start"});
        break;
    }
  })
})

if(/Android/.test(navigator.userAgent)){
  main.style.overflow="hidden";
}

const updateIndicator = (currentPage,pageLength=sections.length)=>{
  indicator.setAttribute("aria-valuetext",`${pageLength}페이지 중 ${currentPage+1} 페이지`);
  indicator.setAttribute("aria-valuenow",`${currentPage+1}`);
  indicator.setAttribute("aria-valuemax",`${pageLength}`);
  indicator.setAttribute("aria-valuemin",`${1}`);
  indicator.setAttribute("aria-live",`polite`);
  indicator.innerHTML = `
    <span aria-hidden="true">${currentPage+1} / ${pageLength}</span>
  `;
  document.querySelector("button#previous").toggleAttribute("disabled", currentPage === 0);
  document.querySelector("button#next").toggleAttribute("disabled", currentPage === pageLength-1);
}

const arrowDetection = (evt)=>{
  switch(evt.code){
    case "ArrowUp":
    case "ArrowLeft":
    case "ArrowRight":
    case "ArrowDown":
      arrowKeyPressed = true;
    break;
  }
}

const mobileHandler = (media)=>{
  htmlElement.classList.toggle("mobile",media.matches);
  if(media.matches){
    main.addEventListener("keydown",arrowDetection)
    htmlElement.removeEventListener("keydown",arrowDetection)
  } else {
    htmlElement.addEventListener("keydown",arrowDetection)
    main.removeEventListener("keydown",arrowDetection);
  }
}
mobileQuery.addEventListener('change',mobileHandler);

mobileHandler(mobileQuery);

updateIndicator(0);
