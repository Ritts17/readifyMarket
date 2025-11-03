const {
  register_fs,
  login_fs,
  getAllUsers_fs,
  resetPassword_fs,
} = require('../controllers/userController_fs'); // Replace 'userController' with the actual filename where your code is located

const { readDataAndPrint, writeDataToFile, addData, displayData,callbackFunction } = require('../Week4Day3&4');

const { writeDataToFileUsingFileSystem, readDataAndPrintUsingFileSystem } = require('../Week4day5');

const Order = require('../models/order'); 

const Book = require('../models/book');
const {
    getAllBooks,
    getBookById,
    addBook,
    updateBook,
    deleteBook
} = require('../controllers/bookController');

jest.mock('../models/book');



const { getUserByEmailAndPassword, addUser } = require('../controllers/userController');
const User = require('../models/user');

jest.mock('../models/user'); // Mock the User model
jest.mock('../middleware/auth', () => ({
  generateToken: jest.fn().mockReturnValue('mocked_token'),
}));



const { 
  deleteOrder, getAllOrders 
} = require('../controllers/orderController');



const { 
  addReview, 
  deleteReview 
} = require('../controllers/reviewController');

const Review = require('../models/review');

const { addBook_fs, getAllBooks_fs, getBookById_fs, deleteBookById_fs } = require('../controllers/bookController_fs');

jest.mock('../models/review'); // Mock the Review model


jest.mock('../models/order'); // Mock the Order model


describe('Week4', () => {


  test('Week4_Day3_add_data_should_be_defined', () => {
    expect(addData).toBeDefined();
    expect(typeof addData).toBe('function');
  });

  test('Week4_Day3_display_data_should_be_defined', () => {
    expect(displayData).toBeDefined();
    expect(typeof displayData).toBe('function');
  });

  test('Week4_Day3_callback_should_be_defined', () => {
    expect(callbackFunction).toBeDefined();
    expect(typeof callbackFunction).toBe('function');
  });


  test('Week4_Day4_write_data_to_file_should_be_defined', () => {
    expect(writeDataToFile).toBeDefined();
    expect(typeof writeDataToFile).toBe('function');
  });

  test('Week4_Day4_read_data_and_print_should_be_defined', () => {
    expect(readDataAndPrint).toBeDefined();
    expect(typeof readDataAndPrint).toBe('function');
  });


  test('Week4_Day5_read_data_and_print_using_file_system_should_be_defined', () => {
    expect(readDataAndPrintUsingFileSystem).toBeDefined();
    expect(typeof readDataAndPrintUsingFileSystem).toBe('function');
  });

  test('Week4_Day5_write_data_to_file_using_file_system_should_be_defined', () => {
    expect(writeDataToFileUsingFileSystem).toBeDefined();
    expect(typeof writeDataToFileUsingFileSystem).toBe('function');
  });

    test('Week5_Day1_register_fs_function_should_be_defined', () => {
      expect(register_fs).toBeDefined();
      expect(typeof register_fs).toBe('function');
    });
  
    test('Week5_Day1_login_fs_function_should_be_defined', () => {
      expect(login_fs).toBeDefined();
      expect(typeof login_fs).toBe('function');
    });
  
    test('Week5_Day1_reset_password_fs_function_should_be_defined', () => {
      expect(resetPassword_fs).toBeDefined();
      expect(typeof resetPassword_fs).toBe('function');
    });
  
    test('Week5_Day1_get_all_users_fs_function_should_be_defined', () => {
      expect(getAllUsers_fs).toBeDefined();
      expect(typeof getAllUsers_fs).toBe('function');
    });

  });

  describe('Week5_Day2', () => {
    test('Week5_Day2_addBook_fs_should_be_defined', () => {
        expect(addBook_fs).toBeDefined();
        expect(typeof addBook_fs).toBe('function');
    });

    test('Week5_Day2_getAllBooks_fs_should_be_defined', () => {
        expect(getAllBooks_fs).toBeDefined();
        expect(typeof getAllBooks_fs).toBe('function');
    });
});

describe('Week5_Day3', () => {
    test('Week5_Day3_getBookById_fs_should_be_defined', () => {
        expect(getBookById_fs).toBeDefined();
        expect(typeof getBookById_fs).toBe('function');
    });

    test('Week5_Day3_deleteBookById_fs_should_be_defined', () => {
        expect(deleteBookById_fs).toBeDefined();
        expect(typeof deleteBookById_fs).toBe('function');
    });
});


describe('Week5_Day4 Book Controller', () => {
  
  // ✅ Get all books successfully
  test('Week5_Day4_Should_Get_All_Books_Successfully', async () => {
    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    const mockBooks = [
      {
        _id: '1',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        description: 'A classic novel set in the Jazz Age.',
        price: 300,
        stockQuantity: 10,
        category: 'Fiction',
        coverImage: 'https://8080-fdafbdaa333087660defeaefeone.premiumproject.examly.io/images/gatsby.jpg'
      },
      {
        _id: '2',
        title: 'A Brief History of Time',
        author: 'Stephen Hawking',
        description: 'An overview of cosmology and the universe.',
        price: 500,
        stockQuantity: 5,
        category: 'Science',
        coverImage: 'https://8080-fdafbdaa333087660defeaefeone.premiumproject.examly.io/images/history.jpg'
      }
    ];

    Book.find.mockResolvedValue(mockBooks);

    await getAllBooks(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockBooks);
  });

  // ❌ Get all books failure
  test('Week5_Day4_Should_Handle_Errors_And_Respond_With_A_500_Status_Code_In_Get_All_Books', async () => {
    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    Book.find.mockRejectedValue(new Error('Database Error'));

    await getAllBooks(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database Error' });
  });

  // ✅ Get book by ID successfully
  test('Week5_Day4_Should_Get_Book_By_ID_Successfully', async () => {
    const req = { params: { id: '1' } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    const mockBook = {
      _id: '1',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      description: 'A classic novel set in the Jazz Age.',
      price: 300,
      stockQuantity: 10,
      category: 'Fiction',
      coverImage: 'https://8080-fdafbdaa333087660defeaefeone.premiumproject.examly.io/images/gatsby.jpg'
    };

    Book.findById.mockResolvedValue(mockBook);

    await getBookById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockBook);
  });

  // ❌ Get book by ID failure
  test('Week5_Day4_Should_Handle_Errors_And_Respond_With_A_500_Status_Code_In_Get_Book_By_ID', async () => {
    const req = { params: { id: '1' } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    Book.findById.mockRejectedValue(new Error('Database Error'));

    await getBookById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database Error' });
  });

  // ✅ Add a new book successfully
  test('Week5_Day4_Should_Add_Book_Successfully', async () => {
    const req = {
      body: {
        title: 'Harry Potter and the Sorcerer\'s Stone',
        author: 'J.K. Rowling',
        description: 'The first book in the Harry Potter fantasy series.',
        price: 450,
        stockQuantity: 8,
        category: 'Fantasy',
        coverImage: 'https://8080-fdafbdaa333087660defeaefeone.premiumproject.examly.io/images/harry.jpg'
      }
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    const mockBook = { _id: '3', ...req.body };

    Book.create.mockResolvedValue(mockBook);

    await addBook(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: "Book Added Successfully", book: mockBook });
  });

  // ❌ Add book failure
  test('Week5_Day4_Should_Handle_Errors_And_Respond_With_A_500_Status_Code_In_Add_Book', async () => {
    const req = { body: { title: 'Some Book' } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    Book.create.mockRejectedValue(new Error('Database Error'));

    await addBook(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database Error' });
  });

  // ✅ Update a book successfully
  test('Week5_Day4_Should_Update_Book_Successfully', async () => {
    const req = { params: { id: '1' }, body: { price: 350 } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    const mockUpdatedBook = {
      _id: '1',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      description: 'A classic novel set in the Jazz Age.',
      price: 350,
      stockQuantity: 10,
      category: 'Fiction',
      coverImage: 'https://8080-fdafbdaa333087660defeaefeone.premiumproject.examly.io/images/gatsby.jpg'
    };

    Book.findByIdAndUpdate.mockResolvedValue(mockUpdatedBook);

    await updateBook(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Book Updated Successfully', book: mockUpdatedBook });
  });

  // ❌ Update book failure
  test('Week5_Day4_Should_Handle_Errors_And_Respond_With_A_500_Status_Code_In_Update_Book', async () => {
    const req = { params: { id: '1' }, body: { price: 350 } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    Book.findByIdAndUpdate.mockRejectedValue(new Error('Database Error'));

    await updateBook(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database Error' });
  });

  // ✅ Delete a book successfully
  test('Week5_Day4_Should_Delete_Book_Successfully', async () => {
    const req = { params: { id: '1' } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    Book.findByIdAndDelete.mockResolvedValue({ _id: '1' });

    await deleteBook(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Book Deleted Successfully' });
  });

  // ❌ Delete book failure
  test('Week5_Day4_Should_Handle_Errors_And_Respond_With_A_500_Status_Code_In_Delete_Book', async () => {
    const req = { params: { id: '1' } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    Book.findByIdAndDelete.mockRejectedValue(new Error('Database Error'));

    await deleteBook(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database Error' });
  });
});

describe('Week5_Day5 User Controller', () => {
  
  test('Week5_Day5_Should_Login_User_Successfully', async () => {
    const req = {
      body: {
        email: 'john@example.com',
        password: 'securepassword',
      },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    const mockUser = {
      _id: 'user123',
      username: 'JohnDoe',
      userRole: 'admin',
    };

    User.findOne.mockResolvedValue(mockUser);
    
    await getUserByEmailAndPassword(req, res);
    
    expect(res.status).toHaveBeenCalledWith(200);

  });

  test('Week5_Day5_Should_Handle_Invalid_Credentials_And_Return_404', async () => {
    const req = {
      body: {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    User.findOne.mockResolvedValue(null);

    await getUserByEmailAndPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

    test('Week5_Day5_Should_Add_User_Successfully', async () => {
    const req = {
      body: {
        username: 'NewUser',
        email: 'newuser@example.com',
        password: 'newpassword',
        userRole: 'user',
      },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    User.create.mockResolvedValue(req.body);

    await addUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Success' });
  });


});

describe('Week5_Day6 Order Controller',() => {
  test('Week5_Day6_Should_Get_All_Orders_Successfully_When_No_Orders_Found', async () => {
    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  
    const mockOrders = []; // 👈 simulate no orders in DB
  
    const mockQuery = {
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockOrders),
    };
  
    Order.find.mockReturnValue(mockQuery);
  
    await getAllOrders(req, res);
  
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('Week5_Day6_Should_Handle_Errors_And_Return_500_Status_Code_In_Get_All_Orders', async () => {
    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  
    // Simulate throwing error
    Order.find.mockImplementation(() => {
      throw new Error('Database Error');
    });
  
    await getAllOrders(req, res);
  
    expect(res.status).toHaveBeenCalledWith(500);
  });
})
  
  describe('Week6_Day1 Order Controller', () => {
    test('Week6_Day1_Should_Delete_Order_Successfully', async () => {
      const req = { params: { id: '1' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      Order.findByIdAndDelete.mockResolvedValue({ _id: '1' });
  
      await deleteOrder(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Order Deleted Successfully' });
    });
  
    test('Week6_Day1_Should_Handle_Errors_And_Return_500_Status_Code_In_Delete_Order', async () => {
      const req = { params: { id: '1' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      Order.findByIdAndDelete.mockRejectedValue(new Error('Database Error'));
  
      await deleteOrder(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database Error' });
    });
  
  });

  describe('Week6_Day2 Review Controller', () => {
    test('Week6_Day2_Should_Add_Review_Successfully', async () => {
      const req = { body: { userId: 'user1', dogId: 'dog1', rating: 5, comment: "Love this dog!" } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockReview = {
        _id: '3',
        reviewText: 'Love this dog!', 
        rating: 5,
        user: 'user1', 
        dog: 'dog1', 
        date: new Date() // optional, auto-set by schema if not given
      };
      
      Review.create.mockResolvedValue(mockReview);
  
      await addReview(req, res);
  
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Review Added Successfully', review: mockReview });
    });
  
    test('Week6_Day2_Should_Handle_Errors_And_Return_500_Status_Code_In_Add_Review', async () => {
      const req = { body: {
        _id: '3',
        reviewText: 'Love this dog!', // ✅ mapped correctly from `comment`
        rating: 5,
        user: 'user1', // ✅ referenced ObjectId
        dog: 'dog1', // ✅ referenced ObjectId
        date: new Date() // optional, auto-set by schema if not given
      }
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      Review.create.mockRejectedValue(new Error('Database Error'));
  
      await addReview(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database Error' });
    });
  

  });

  describe('Week6_Day3 Review Controller', () => {

  
    test('Week6_Day3_Should_Delete_Review_Successfully', async () => {
      const req = { params: { id: '1' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      Review.findByIdAndDelete.mockResolvedValue({ _id: '1' });
  
      await deleteReview(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Review Deleted Successfully' });
    });
  
    test('Week6_Day3_Should_Handle_Errors_And_Return_500_Status_Code_In_Delete_Review', async () => {
      const req = { params: { id: '1' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      Review.findByIdAndDelete.mockRejectedValue(new Error('Database Error'));
  
      await deleteReview(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database Error' });
    });
  
  });
