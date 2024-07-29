import React, { useState } from "react";
import "./App.css";
import axios from "axios";
// import { productDto, productSearchDto, FormValueType } from "./model";


 interface productDto {
  productID : number ;
  productName : string;
  productSpecs : string;
}

 interface productSearchDto{
  productID : number ;
}

 interface productDeleteDto{
  product : number;
}

 interface FormValueType {
  productID: number | string;
  productName: string;
  productSpecs: string;
  _id: string | null;
}

function App() {
  const [productID, setProductID] = useState<number | string>();
  const [productList, setProductList] = useState<any[]>([]);
  const [allProductList, setAllProductList] = useState<any[]>([]);
  const [productName, setProductName] = useState<string>("");
  const [productSpecs, setProductSpecs] = useState<string>("");
  const [searchResult, setSearchResult] = useState<string>("");
  const [searchProductID, setSearchProductID] = useState<number | string>();
  const [formValue, setFormValue] = useState<FormValueType>({
    productID: "",
    productName: "",
    productSpecs: "",
    _id: null,
  });

  const [isUpdate, setIsUpdate] = useState(false);

  const updatesearchProductID = (id: number) => {
    console.log("number", id);
    setSearchProductID(id);
  };

  const updateProductID = (id: number) => {
    console.log("number", id);
    setProductID(id);
  };

  const updateProductName = (name: string) => {
    console.log("name", name);
    setProductName(name);
  };

  const updateProductSpecs = (specs: string) => {
    console.log("specs", specs);
    setProductSpecs(specs);
  };


  
  const handleChange = (e: any) => {
    console.log(e);
    const name = e.target.name;
    const value = e.target.value;
    setFormValue({ ...formValue, [name]: value });
  };

  // handleEdit-->executes when EDIT button is clicked
  // setFormValue(product) --> this updates the input box in submit container with value from the corresponding row.
  // setIsUpdate(true)-------> this changes the 'submit' button into 'Update' button
  const handleEdit = (product: FormValueType) => {
    setFormValue(product);
    setIsUpdate(true);
  };


  const getAllProducts = () => {
    axios
      .get(`http://localhost:5000/viewProducts/viewAllProducts`)
      .then((res) => {
        const resultFromNodejs = res.data;
        setProductList(res.data.Result);
        console.log(allProductList, "pddd");
        setSearchResult(JSON.stringify(resultFromNodejs));
        setAllProductList([]);
      })
      .catch((err) => console.log(err, "err"));
  };

  // this function make 'post' action when given id is not exist and make 'put' action when given id exist.
  const submit = async () => {
    console.log(productID, productName, productSpecs, "is the info of product");
    const productPayload: productDto = {
      productID: formValue.productID as any,
      productName: formValue.productName,
      productSpecs: formValue.productSpecs,
    };
    console.log(formValue,'formvalue');
    if (isUpdate) {
      await axios
        .put(
          `http://localhost:5000/updateproduct/updateProductByID/${formValue.productID}`,
          productPayload
        )
        .then((res) => console.log(res))
        .catch((err) => console.log(err, "err"));
    } else {
      await axios
        .post(
          "http://localhost:5000/insertNewProduct/insertProduct",
          productPayload
        )
        .then((res) => console.log(res))
        .catch((err) => console.log(err, "err"));
    }

    setFormValue({
      productID: "",
      productName: "",
      productSpecs: "",
      _id: null,
    });
    setIsUpdate(false);
    getAllProducts();
  };


  const productSearch = async () => {
    console.log(searchProductID, "is the product ID user has submitted");
    const productSearchPayload: productSearchDto = {
      productID: searchProductID as any,
    };
    try {
      console.log("Before ---->> API Call");
      const searchData = await axios.get(
        `http://localhost:5000/viewProductById/viewProductByID/${searchProductID}`
      );
      console.log("After ---->> API Call");
      if (!searchData.data.Result || searchData.data.Result.length === 0) {
        throw new Error(
          `Product not found for this productId ${searchProductID}`
        );
      }
      const resultFromNodejs = searchData.data;
      console.log("resultFromNodejs --->>", resultFromNodejs);
      setProductList(searchData.data.Result);
      setSearchResult(JSON.stringify(resultFromNodejs));
      setSearchProductID("");
    } catch (error: any) {
      window.confirm(error.message);
      console.log(error, "error");
    }
  };

  const deleteProduct = (productID: any) => {
    console.log(productID, "is the product going to get deleted");
    if (window.confirm("Are you surely want to delete")) {
      fetch(
        `http://localhost:5000/deleteproduct/deleteProductbyID/${productID}`,
        {
          method: "DELETE",
        }
      ).then(() => {
        const updatedProducts = productList.filter(
          (productID: any) => productID.productID !== productID
        );
        setAllProductList(updatedProducts);
        getAllProducts();
      });
    }
  };

  return (
    <div className="Whole_container">
      {/* product submission box */}
      <div className="container_productinsertbox">
        <h3>Product insert box</h3>
        <label>ProductID:</label>
        <input
          name="productID"
          type="number"
          placeholder="ProductID"
          value={formValue.productID}
          onChange={(event) => handleChange(event)}
        ></input>

        <label>ProductName:</label>
        <input
          name="productName"
          type="text"
          placeholder="ProductName"
          value={formValue.productName}
          onChange={(event) => handleChange(event)}
        ></input>

        <label>ProductSpecs:</label>

        <input
          name="productSpecs"
          type="text"
          placeholder="ProductSpecs"
          value={formValue.productSpecs}
          onChange={(event) => handleChange(event)}
        ></input>

        <div className="submitbutton">
          <button onClick={submit}>{isUpdate ? "Update" : "Submit"}</button>
        </div>
      </div>
      {/* product search box */}
      <div className="constainer_productsearchbox">
        <h3>Product search box</h3>
        <label>ProductID:</label>
        <input
          type="number"
          placeholder="ProductID"
          value={searchProductID}
          onChange={(event) =>
            updatesearchProductID(event.target.valueAsNumber)
          }
        ></input>

       
        <div className="submitbutton">
          <button onClick={productSearch}>Search</button>
        </div>
        <div className="resulttable">
          <table>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Product Description</th>
              <th>Action</th>
              <th>
                <button onClick={getAllProducts}>Get All</button>
              </th>
            </tr>
            <hr />
            <tbody>
              {productList.map((product, index) => (
                <tr key={index}>
                  <td>{product.productID}</td>
                  <td>{product.productName}</td>
                  <td>{product.productSpecs}</td>
                  <td>
                    <button onClick={() => handleEdit(product)}>Edit</button>
                  </td>
                  <td>
                    <button onClick={() => deleteProduct(product.productID)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;

