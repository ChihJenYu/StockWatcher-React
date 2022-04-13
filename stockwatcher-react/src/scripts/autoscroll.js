export const autoscroll = (stock) => {
    const viewport = document.querySelector('.news-viewport');
    const customLoader = document.querySelector('.custom-loader');
    const generateHref = element => element['link'];
    const generateTitle = element => element['title'];
    const generatePubDate = element => element['pubDate'].split(':')[0].slice(0, -3);
    let newsStart = 11;
    const startDate = document.querySelector('.start-date').value;
    const endDate = document.querySelector('.end-date').value;
    customLoader.style.display = 'none';
    viewport.addEventListener('scroll', () => {
        if ((viewport.scrollTop + viewport.offsetHeight) >= viewport.scrollHeight) {
            customLoader.style.display = 'block';
            fetch(`/${stock}/news?start=` + (+newsStart) + '&begin=' + startDate + '&end=' + endDate)
                .then(res => res.json())
                .then(data => {
                    const news = data['news'];
                    newsStart += 10;
                    customLoader.style.display = 'none';
                    for (let i = 0; i < news.length; i++) {
                        viewport.innerHTML +=
                            `<div class=item><a class=news-title target=_blank href=${generateHref(news[i])}>${generateTitle(news[i])}</a><p class=news-pub-date>${generatePubDate(news[i])}</p></div>`
                            ;
                    };
                    viewport.scrollTop += 30;
                })
        };
    });
}