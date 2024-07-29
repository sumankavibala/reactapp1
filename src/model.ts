export interface productDto {
    productID : number ;
    productName : string;
    productSpecs : string;
}

export interface productSearchDto{
    productID : number ;
}

export interface productDeleteDto{
    product : number;
}

export interface FormValueType {
    productID: number | string;
    productName: string;
    productSpecs: string;
    _id: string | null;
  }