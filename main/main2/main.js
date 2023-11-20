function Sleep(s) 
{
    return new Promise(resolve => setTimeout(resolve, s * 1000));
}

function GetAdaptive() 
{
    return (window.screen.width >= 768) + (window.screen.width >= 1024);
}

function formats(ele, e) 
{
    if(ele.value.length < 24)
    {
      ele.value= ele.value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ');
      return true;
    }
    else
    {
      return false;
    }
}
  
function numberValidation(e)
{
    e.target.value = e.target.value.replace(/[^\d ]/g,'');
    return false;
}

document.addEventListener("scroll", OnScroll);

const root = document.querySelector(":root");

sectionEndPoints = [getComputedStyle(root).getPropertyValue("--aboutScreenHeights").split(' '),
                    getComputedStyle(root).getPropertyValue("--petsScreenHeights").split(' '),
                    getComputedStyle(root).getPropertyValue("--helpScreenHeights").split(' ')]

for (let i = 0; i < sectionEndPoints.length; ++i)
    for (let j = 0; j <= 2; ++j)
        sectionEndPoints[i][j] = parseInt(sectionEndPoints[i][j].slice(0, -1).replace("px", ''));

let temp = document.getElementsByClassName("header__tab");
let tabs = [[], [], [], []]

for (let i = 0; i < temp.length; ++i)
    tabs[parseInt(temp[i].getAttribute("tabId"))].push(temp[i]);

let headerWrapper = document.getElementsByClassName("header__wrapper")[0];
let blackout = document.getElementById("blackout");
let startScreenHeights = getComputedStyle(root).getPropertyValue("--startScreenHeights").split(' ');
let endScreenHeights = getComputedStyle(root).getPropertyValue("--endScreenHeights").split(' ');
let currentTab = -1;
let currentBreakPoint = 0;
let offset = [-650, -900, -300];
let lastOffset = [-1100, -1000, -350];

for (let i = 0; i <= 2; ++i)
{
    startScreenHeights[i] = startScreenHeights[i].slice(0, -1).replace("px", '');
    endScreenHeights[i] = endScreenHeights[i].slice(0, -1).replace("px", '');
}

function CloseOpened()
{
    if (document.getElementById("burger-btn").getAttribute("state") == 1)
        OnClickBurger();

    if (document.getElementsByClassName("pet-pop-up")[0].getAttribute("state") == 1)
        document.getElementsByClassName("pet-pop-up")[0].setAttribute("state", 0);

    blackout.setAttribute("state", 0);
}

function OnClickBurger()
{
    ToggleElementState(blackout);
    ToggleElementState(document.getElementById("burger-btn"));
    ToggleElementState(document.getElementById("burger-menu"));
    let state = ToggleElementState(document.getElementById("burger-menu__list"));
}
    
function ToggleElementState(element)
{
    let state = element.getAttribute("state");

    if (state == null)
    {
        element.setAttribute("state", "0");
        Sleep(0.1).then(() => element.setAttribute("state", state == 1 ? 0 : 1));
    }
    else
    {
        element.setAttribute("state", state == 1 ? 0 : 1);
    }

    return state == 1 ? 0 : 1;
}

function OnScroll()
{
    let breakPoint = 0;

    for (let i = 0; i < sectionEndPoints.length + 1; ++i)
    {
        if (i == 0)
            breakPoint += parseInt(startScreenHeights[GetAdaptive()]);
        else
            breakPoint += sectionEndPoints[i - 1][GetAdaptive()];

        let scrollY = window.scrollY + ((i == sectionEndPoints.length) ? lastOffset[GetAdaptive()] : offset[GetAdaptive()]);

        if ((scrollY > currentBreakPoint && breakPoint > currentBreakPoint) ||
            (scrollY < currentBreakPoint && breakPoint < currentBreakPoint))
        {
            SetActiveTab(i);
            currentBreakPoint = breakPoint;
        }

    }

    let state = headerWrapper.getAttribute("state");

    if (state == null)
        state = 0;

    if (window.scrollY >= startScreenHeights[GetAdaptive()] && 
        window.scrollY <= document.body.scrollHeight - endScreenHeights[GetAdaptive()])
    {
        if (state == 0)
            ToggleElementState(headerWrapper);
    }
    else if (state == 1)
    {
        ToggleElementState(headerWrapper);
    }
}

function SetActiveTab(tabIndex)
{
    for (let i = 0; i < 4; ++i)
    {
        for (let j = 0; j < tabs[i].length; ++j)
        {
            if (i == tabIndex && tabs[i][j].getAttribute("state") != 1)
                tabs[i][j].setAttribute("state", 1);
            else if (i != tabIndex && tabs[i][j].getAttribute("state") == 1)
                tabs[i][j].setAttribute("state", 0);
        }
    }
}

SetActiveTab(0);