export function saveToLocal(id,key,value){
	let seller = window.localStorage._seller_
	if(!seller){
		seller = {}
		seller[id] = {}
		seller[id][key] = value
	}else{
		seller = JSON.parse(seller)
		if(!seller[id]){
			seller[id] = {};
		}
	}
	seller[id][key] = value
	window.localStorage._seller_ = JSON.stringify(seller)
}
export function loadFromLocal(id,key,def){
	let seller = window.localStorage._seller_
	if(!seller){
		return def
	}
	seller =  JSON.parse(seller)[id]
	if(!seller){
		return def
	}
	let ret = seller[key]
	return ret || def
}
export function saveFoodCount(id,count,name){
	let foods = window.localStorage._foods_
	if(!foods){
		foods = {}
		foods[id] = {}
		foods[id]['quantity'] = count
		foods[id]['name'] = name
	}else{
		foods = JSON.parse(foods)
		if(!foods[id]){
			foods[id] = {}
		}
	}
	foods[id]['quantity'] = count
	foods[id]['name'] = name
	window.localStorage._foods_ = JSON.stringify(foods)
}
export function loadFoodCount(id){
	let foods = window.localStorage._foods_
	if(!foods){
		return
	}
	foods =  JSON.parse(foods)[id]
	if(!foods){
		return
	}
	let ret = foods["quantity"]
	return ret || 0
}









