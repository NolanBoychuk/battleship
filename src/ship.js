function ship(length, xRef, yRef, orient){
    const shipObj = {
        length,
        hits:0,
        sunk:false,
        xRef,
        yRef,
        orient,
    };
    shipObj.hit = function(){
        this.hits +=1;
    };
    shipObj.isSunk = function(){
        if(this.hits === this.length){
            return true;
        }
        return false;
    };
    return shipObj;
};
export { ship };