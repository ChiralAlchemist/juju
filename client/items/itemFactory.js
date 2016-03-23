angular.module('itemFactory', [])
.factory('Item', function(Auth, $http){
  var addItemFuncs ={};
  var userId = Auth.userId;
  //pull in user info from the auth factory
  addItemFuncs.addItemToDB =function (itemInfo){
    data={
      itemNickName : itemInfo.nickName,
      productTitle : itemInfo.productTitle,
      itemUrl : itemInfo.URL,
      itemImageUrl : itemInfo.imageUrl,
      currentPrice : itemInfo.currentPrice,
      idealPrice : itemInfo.idealPrice,
      createdDate : itemInfo.createdDate.toDateString(),
      userId : userId
    };

    return $http({
      method: 'POST',
      url: '/api/items',
      data: data
    });
  },
  addItemFuncs.getCategories = function(userId){
    return $http({
      method : 'GET',
      url: 'api/items/categories/' + userId
    })
  }
  addItemFuncs.scrapePriceInfo = function(itemInfo){
    data = {
      url : itemInfo.URL
    };

    return $http({
      method : 'POST',
      url : '/scrape',
      data : data
    }).then(function(response){
      console.log(response)
    });
  },

  addItemFuncs.scrapePicture = function (url){
    data = {
      url : url
    };

    return $http({
      method : 'POST',
      url : '/scrape',
      data: data
    });
  };

  addItemFuncs.checkAbleTosend = function (item) {
    var sampleItem = {
      productTitle : 'String',
      userId : 'String',
      currentPrice : 'String',
      imageUrl : 'String'
    }
    for(property in sampleItem){
      if(item[property] === undefined) {
        alert(property + ' is missing');
        return  false;
      }
    }
    if(parseInt(item['currentPrice'],10)===NaN){
      alert('could not get price')
      return false;
    }
    return true;
  }

  return addItemFuncs;
})
.factory('displayItemsFactory', function ($http){
  var displayItemsFactoryFuncts = {};
  displayItemsFactoryFuncts.getItemData = function(user){
    return $http({
      method : 'GET',//'POST',
      url : '/api/watchedItems/user/'+ user
    });
  };

  displayItemsFactoryFuncts.getItemHistoryData = function(userId){
    console.log('userId' , userId)
    console.log('item history url is', '/api/itemHistory/user/' + userId)
    return $http({
      method : 'GET' ,
      url : '/api/itemHistory/user/' + userId
    });
  }

  displayItemsFactoryFuncts.deleteData = function(watchedId){
    return $http({
      method : 'DELETE',
      url: '/api/watchedItems/'+watchedId
    });
  };
  
  displayItemsFactoryFuncts.updateData = function (watchedId, watchedObj) {
    return $http({
          method: 'PUT',
          url: '/api/watchedItems/'+watchedId,
          data: watchedObj
    })
  };
  displayItemsFactoryFuncts.organizeData = function (itemHistory) {
  //   var orgData = {};
  //   var itemId;
  //   var aHistroy;
  // //group the itemData based on itemId 
  //   for(var entryId in itemHistory) {
  //     aHistory = itemHistory[entryId];
  //     itemId = itemHistory[entryId].itemid;
  //     orgData[itemId] !==undefined ? orgData[itemId].push(aHistory) : orgData[itemId] = [aHistory]
  //   }
  
  // //sort itemData by date for each time
  //   for(var item in orgData){
  //     orgData[item].sort(function(a, b) {
  //     a = new Date(a.dateModified);
  //     b = new Date(b.dateModified);
  //     return a>b ? -1 : a<b ? 1 : 0;
  //     });
  //     orgData[item].graphData = displayItemsFactoryFuncts.makeLabels(orgData[item])
  //   }
    
  //   return orgData;

  var orgData = {};
  var itemId;
  var aHistroy;
  //group the itemData based on itemId 
  for(var entryId in itemHistory) {
    aHistory = itemHistory[entryId];
    console.log(aHistory)
    itemId = itemHistory[entryId].nickname;
    orgData[itemId] !==undefined ? orgData[itemId].push(aHistory) : orgData[itemId] = [aHistory]
  }
  
  //sort itemData by date for each time
  for(var item in orgData){
    console.log(typeof orgData)
    orgData[item].sort(function(a, b) {
    a = new Date(a.checkdate);
    b = new Date(b.checkdate);
    return a>b ? 1 : a<b ? -1 : 0;
    });
    orgData[item].priceGraph = displayItemsFactoryFuncts.makeLabels(orgData[item])
  }
    
  return orgData;
  }

  displayItemsFactoryFuncts.makeLabels = function (itemData) {
  if(itemData<5){
    return [];
  }
  var graphData = [];
  var datesArray = [];
  var pricesArray = [];
  var date;
  var price;
  for(var i=0; i< itemData.length;i++){
    //make dateString
    date = new Date(itemData[i].checkdate);
    dateStr = date.getMonth() + '/' + date.getDate();
    datesArray.push(dateStr);
    
    //arrange price data
    if(itemData[i].price !==null){
      pricesArray.push(Number(itemData[i].price.slice(1)));
    }
  }
  graphData.push([datesArray, [pricesArray]]);
  return graphData;
}

  return displayItemsFactoryFuncts;
})

