# E-commerce Store API

This project implements a backend API for a simple e-commerce store. Clients can add items to their cart and checkout to place orders. Every *n*th order receives a discount code that can be applied to their cart during checkout. The API also includes admin endpoints to manage discount codes and view store statistics.

## Description

The API provides the following functionalities:

* **Adding Items to Cart:** Allows clients to add items to their virtual shopping cart.
* **Checkout:** Enables clients to finalize their order, apply discount codes (if valid), and receive a new discount code upon every *n*th successful order.
* **Discount Code Generation (Admin):** An admin API to manually trigger the generation of a discount code based on the order count.
* **Store Statistics (Admin):** An admin API to view the count of items purchased, total purchase amount, a list of discount codes, and the total discount amount given.

The API uses an in-memory store, so no external database is required.

## Technology Stack

* **Python:** The programming language used.
* **FastAPI:** A modern, fast (high-performance), web framework for building APIs with Python.
* **Pydantic:** Used for data validation and serialization.
* **pytest:** A framework for writing and running unit tests.

## Prerequisites

* **Python 3.8+** installed on your system.
* **pip** (Python package installer) installed.

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/bhanuUdai/uniblox_-ecommerce.git
    cd UNIBLOX
    ```

2.  **Create a virtual environment (recommended):**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On macOS and Linux
    venv\Scripts\activate  # On Windows
    ```

3.  **Install the required dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

    You can create the `requirements.txt` file with the following content:

    ```
    fastapi
    uvicorn
    pydantic
    pytest
    ```

## Running the Application

1.  Navigate to the `app` directory:
    ```bash
    cd app
    ```

2.  Run the FastAPI application:
    ```bash
    fastapi dev app/main.py       
    ```

    * `main`: The name of your main Python file (where the FastAPI instance is created).
    * `app`: The name of the FastAPI application instance in `main.py`.

Once the server is running, open [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) for interactive API documentation.


## API Endpoints

### Client APIs

* **`POST /cart/add`**
    * **Request Body:**
        ```json
        {
          "item_id": int,
          "quantity": int,
          "name": str,
          "price": float
        }
        ```
    * **Description:** Adds the specified item and quantity to the cart.
    * **Response:**
        ```json
        {
          "message": "X x Y added to cart"
        }
        ```

* **`POST /checkout`**
    * **Request Body (optional):**
        ```json
        {
          "discount_code": "string"
        }
        ```
    * **Description:** Processes the checkout for the items in the cart. Optionally accepts a discount code.
    * **Response:**
        ```json
        {
          "total_amount": float,
          "discount_applied": boolean,
          "new_discount_code": "string" (only if the order is the nth order)
        }
        ```

### Admin APIs

* **`POST /admin/discount/generate`**
    * **Description:** Manually triggers the generation of a discount code if the current order count satisfies the condition (every nth order).
    * **Response:**
        ```json
        {
          "code": "string"
        }
        ```
        or
        ```json
        {
          "message": "No discount code generated. Next discount available after X more orders."
        }
        ```

* **`GET /admin/stats`**
    * **Description:** Retrieves store statistics.
    * **Response:**
        ```json
        {
          "total_items_purchased": int,
          "total_purchase_amount": float,
          "discount_codes": list[str],
          "total_discount_amount": float
        }
        ```

## Testing the Application

1.  Ensure you have installed `pytest`:
    ```bash
    pip install pytest
    ```

2.  Navigate to the root directory of the project (where the `tests` folder is located).

3.  Run the unit tests using the following command:
    ```bash
    pytest tests
    ```

    This will discover and run all the test functions in the `tests/test_main.py` file. The output will indicate whether the tests passed or failed.

## Assumptions

* The API uses an in-memory store, so data is not persisted across application restarts.
* A single global cart is used for simplicity. In a real application, you would likely have user-specific carts.
* The value of 'n' (for every nth order discount) is currently set to 5 in the `app/service.py` file.

## Further Improvements (Optional)

* Implement user authentication and user-specific carts.
* Persist data using a database.
* Add more comprehensive error handling and validation.
* Implement different types of discounts or more complex discount rules.
* Create a user interface to interact with the API.