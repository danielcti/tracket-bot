function formatProduct(items){
    let result = "";
    items.forEach((item, i) => {
      if (i < 10) {
        let formattedItem = `${i + 1})\n`;
        formattedItem += `Título: ${item.title}\n`;
        formattedItem += `Preço: R$${item.price}\n`;
        formattedItem += `Link: ${item.url}\n\n`;
        result += formattedItem;
      }
    });
    return result;
}

const items = [
  {
    url: "https://br.gearbest.com",
    id: 1,
    site: "Gearbest",
    categorySelectorParent: ".headCate_item",
    categorySelectorChild: " > a",
    itemSelectorParent: ".gbGoodsItem",
    itemSelectorChild: ".gbGoodsItem_outBox",
    titleSelector: ".gbGoodsItem_title",
    priceSelector: ".gbGoodsItem_price",
    urlSelector: ".gbGoodsItem_title",
  },
  {
    url: "https://pt.aliexpress.com/",
    id: 2,
    site: "Ali Express",
    categorySelectorParent: ".categories-list-box > dl.cl-item",
    categorySelectorChild: " a:first-child",
    itemSelectorParent: "._1OUGS",
    itemSelectorChild: "._1OUGS",
    titleSelector: ".awV9E",
    priceSelector: "._12A8D",
    urlSelector: ".awV9E",
  },
  {
    url: 'https://kabum.com.br/destaques',
    id: 3,
    site: 'KaBuM!',
    categorySelectorParent: '#blocoCategoriasListagem .linkCategoriaListagem',
    categorySelectorChild: ' a',
    itemSelectorParent: ".productCard",
    itemSelectorChild: ".productCard",
    titleSelector: ".nameCard",
    priceSelector: ".availablePricesCard",
    urlSelector: "a",
  }
];
module.exports = {formatProduct, items}