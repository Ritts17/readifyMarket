import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
import store from '../store';
import AdminNav from "../AdminComponents/AdminNav";
import UserNav from "../UserComponents/UserNav";
import { CartProvider } from "../CartContext";
import HomePage from "../Components/HomePage";
import Login from "../Components/Login";
import Signup from "../Components/Signup";
import ForgotPassword from "../Components/ForgotPassword";
import ErrorPage from "../Components/ErrorPage";
import UserReview from "../UserComponents/UserReview";
import UserMyReview from "../UserComponents/UserMyReview";
import UserViewOrders from "../UserComponents/UserViewOrders";
import OrderPlaced from "../AdminComponents/OrderPlaced";
import AdminViewReviews from "../AdminComponents/AdminViewReviews";
import BookForm from "../AdminComponents/BookForm";
import AdminViewBooks from "../AdminComponents/AdminViewBooks";


const queryClient = new QueryClient();

describe("Week7 Day5", () => {
  describe("AdminNav Component", () => {
    const renderAdminNavComponent = (props = {}) => {
      return render(
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <Router>
              <ToastProvider>
                <AdminNav {...props} />
              </ToastProvider>
            </Router>
          </QueryClientProvider>
        </Provider>
      );
    };

    beforeEach(() => {
      localStorage.setItem("userName", "TestAdmin");
      localStorage.setItem("userRole", "Admin");
    });

    afterEach(() => {
      localStorage.clear();
    });

    test("week7_day5_adminnav_component_renders_with_home_link", () => {
      renderAdminNavComponent();
      const homeLink = screen.getAllByText("Home");
      expect(homeLink.length).toBeGreaterThan(0);
    });

    test("week7_day5_adminnav_component_renders_with_dashboard_reviews_and_orders_link", () => {
      renderAdminNavComponent();
      const dashboardLink = screen.getAllByText("Dashboard");
      expect(dashboardLink.length).toBeGreaterThan(0);
      const ordersLink = screen.getAllByText("Orders");
      expect(ordersLink.length).toBeGreaterThan(0);
      const reviewsLink = screen.getAllByText("Reviews");
      expect(reviewsLink.length).toBeGreaterThan(0);
    });
  });

  describe("UserNav Component", () => {
    const renderUserNavComponent = (props = {}) => {
      return render(
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <Router>
              <ToastProvider>
                <UserNav {...props} />
              </ToastProvider>
            </Router>
          </QueryClientProvider>
        </Provider>
      );
    };
  
    beforeEach(() => {
      localStorage.setItem("userName", "TestUser");
      localStorage.setItem("userRole", "User");
    });
  
    afterEach(() => {
      localStorage.clear();
    });
  
    test("week7_day5_usernav_component_renders_with_home_link", () => {
      renderUserNavComponent();
      const homeLink = screen.getAllByText("Home");
      expect(homeLink.length).toBeGreaterThan(0);
    });
  
    test("week7_day5_usernav_component_renders_with_books_and_review_dropdown", () => {
      renderUserNavComponent();
      const booksDropdown = screen.getAllByText("Books");
      expect(booksDropdown.length).toBeGreaterThan(0);
      const reviewDropdown = screen.getAllByText("Review");
      expect(reviewDropdown.length).toBeGreaterThan(0);
    });
  
    test("week7_day5_usernav_component_renders_with_logout_button", () => {
      renderUserNavComponent();
      const logoutButton = screen.getAllByText("Logout");
      expect(logoutButton.length).toBeGreaterThan(0);
    });
  });
  

  describe("HomePage Component", () => {
    const renderHomePageComponent = (props = {}) => {
      return render(
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <Router>
              <ToastProvider>
                <CartProvider>
                  <HomePage {...props} />
                </CartProvider>
              </ToastProvider>
            </Router>
          </QueryClientProvider>
        </Provider>
      );
    };
  
    afterEach(() => {
      localStorage.clear();
    });
  
    test("week7_day5_homepage_component_renders_with_contact_us_heading", () => {
      renderHomePageComponent();
      expect(screen.getByText("Contact Us")).toBeInTheDocument();
    });
  
    test("week7_day5_homepage_component_renders_heading", () => {
      renderHomePageComponent();
      const readifyElements = screen.getAllByText(/Readify Market/i);
      expect(readifyElements.length).toBeGreaterThan(0);
    });
  });
  
});

 describe("Week7 Day6", () => {
  describe("Login Component", () => {
    const renderLoginComponent = (props = {}) => {
      return render(
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <Router>
              <ToastProvider>
                <CartProvider>
                  <Login {...props} />
                </CartProvider>
              </ToastProvider>
            </Router>
          </QueryClientProvider>
        </Provider>
      );
    };
  
    beforeEach(() => {
      localStorage.clear();
    });
  
    test("week7_day6_login_component_renders_with_brand_heading", () => {
      renderLoginComponent();
      const heading = screen.getAllByText("Readify Market");
      expect(heading.length).toBeGreaterThan(0);
    });
  
    test("week7_day6_login_component_renders_with_login_heading", () => {
      renderLoginComponent();
      const loginHeading = screen.getAllByText("Login");
      expect(loginHeading.length).toBeGreaterThan(0);
    });
  
    test("week7_day6_login_component_renders_with_email_placeholder", () => {
      renderLoginComponent();
      const emailInput = screen.getByPlaceholderText("Email");
      expect(emailInput).toBeInTheDocument();
    });
    
    test("week7_day6_login_component_renders_with_password_placeholder", () => {
      renderLoginComponent();
      const passwordInput = screen.getByPlaceholderText("Password");
      expect(passwordInput).toBeInTheDocument();
    });
    
    test("week7_day6_login_component_renders_with_forgot_password_link", () => {
      renderLoginComponent();
      const forgotPasswordLink = screen.getByText("Forgot Password?");
      expect(forgotPasswordLink).toBeInTheDocument();
    });
  
    test("week7_day6_login_component_renders_with_signup_link", () => {
      renderLoginComponent();
      const signupLink = screen.getByText("Signup");
      expect(signupLink).toBeInTheDocument();
    });
  
    test("week7_day6_login_component_shows_validation_errors_when_submit_empty", () => {
      renderLoginComponent();
      const loginButton = screen.getByRole("button", { name: /Login/i });
      fireEvent.click(loginButton);
  
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });
  });
  
  describe("BookForm Component", () => {
    const renderBookFormComponent = (props = {}) => {
      return render(
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <Router>
              <ToastProvider>
                <CartProvider>
                  <BookForm {...props} />
                </CartProvider>
              </ToastProvider>
            </Router>
          </QueryClientProvider>
        </Provider>
      );
    };
  
    test("week7_day6_bookform_component_renders_with_heading_add_new_book", () => {
      renderBookFormComponent();
      const heading = screen.getByText("Add New Book");
      expect(heading).toBeInTheDocument();
    });
  
    test("week7_day6_bookform_component_shows_validation_errors_when_submit_empty", () => {
      renderBookFormComponent();
  
      const submitButton = screen.getByRole("button", { name: /Add Book/i });
      fireEvent.click(submitButton);
  
      expect(screen.getByText("Book title is required")).toBeInTheDocument();
      expect(screen.getByText("Author is required")).toBeInTheDocument();
      expect(screen.getByText("Price is required")).toBeInTheDocument();
      expect(screen.getByText("Stock Quantity is required")).toBeInTheDocument();
      expect(screen.getByText("Category is required")).toBeInTheDocument();
      expect(screen.getByText("Description is required")).toBeInTheDocument();
      expect(screen.getByText("Cover Image is required")).toBeInTheDocument();
    });
  });
});





describe("Week8 Day1",()=>{
  describe("Error Page Component", () => {
    const renderErrorPageComponent = (props = {}) => {
      return render(
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <Router>
              <ToastProvider>
                <CartProvider>
                  <ErrorPage {...props} />
                </CartProvider>
              </ToastProvider>
            </Router>
          </QueryClientProvider>
        </Provider>
      );
    };

    afterEach(() => {
      localStorage.clear();
    });

    test("week8_day1_errorpage_component_renders_with_heading", () => {
      renderErrorPageComponent();
      const errorElements = screen.getAllByText(/Oops! Something Went Wrong/i);
      expect(errorElements.length).toBeGreaterThan(0);    });

    test("week8_day1_errorpage_component_renders_with_content", () => {
      renderErrorPageComponent();
      const errorElements = screen.getAllByText(/Please try again later./i);
      expect(errorElements.length).toBeGreaterThan(0);
    });
  });
 })

 describe("Week8 Day2", () => {
  describe("renderAdminViewBooksComponent ", () => {
    const renderAdminViewBooksComponent = (props = {}) => {
      return render(
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <Router>
              <ToastProvider>
                <CartProvider>
                  <AdminViewBooks {...props} />
                </CartProvider>
              </ToastProvider>
            </Router>
          </QueryClientProvider>
        </Provider>
      );
    };
  
    test("week8_day2_adminviewbooks_component_renders_with_heading_manage_books", () => {
      renderAdminViewBooksComponent();
      const heading = screen.getByText(/Manage Books/i);
      expect(heading).toBeInTheDocument();
    });
  
    test("week8_day2_adminviewbooks_component_renders_search_input", () => {
      renderAdminViewBooksComponent();
      const searchInput = screen.getByPlaceholderText(/Search books.../i);
      expect(searchInput).toBeInTheDocument();
    });
  });
 });


describe("Week8 Day3", () => {
  describe("UserReview Component", () => {
  const renderAddReviewComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <ToastProvider>
              <CartProvider>
                <UserReview {...props} />
              </CartProvider>
            </ToastProvider>
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  };

  test("week8_day3_userreview_component_renders_heading_share_your_review", () => {
    renderAddReviewComponent();
    const heading = screen.getByText(/Share Your Thoughts/i);
    expect(heading).toBeInTheDocument();
  });

  test("week8_day3_userreview_component_renders_textarea", () => {
    renderAddReviewComponent();
    const textarea = screen.getByPlaceholderText(/Write your review here/i);
    expect(textarea).toBeInTheDocument();
  });

  test("week8_day3_userreview_component_renders_submit_button", () => {
    renderAddReviewComponent();
    const button = screen.getByRole("button", { name: /Submit Review/i });
    expect(button).toBeInTheDocument();
  });
});

  describe("UserMyReview Component", () => {
    const renderMyReviewsComponent = (props = {}) => {
      return render(
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <Router>
              <ToastProvider>
                <CartProvider>
                  <UserMyReview {...props} />
                </CartProvider>
              </ToastProvider>
            </Router>
          </QueryClientProvider>
        </Provider>
      );
    };

    test("week8_day3_usermyreview_component_renders_heading", () => {
      renderMyReviewsComponent();
      const heading = screen.getByText(/My Book Reviews/i);
      expect(heading).toBeInTheDocument();
    });
  });
});

describe("Week8 Day4", () => {
  describe("UserViewOrders", () => {
  const renderUserViewOrdersComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <ToastProvider>
              <CartProvider>
                <UserViewOrders {...props} />
              </CartProvider>
            </ToastProvider>
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  };

  test("week8_day4_uservieworders_component_renders_heading", () => {
    renderUserViewOrdersComponent();
    const heading = screen.getByText(/Order History/i);
    expect(heading).toBeInTheDocument();
  });
});
});


  describe("Week8 Day5", () => {
    describe("OrderPlaced", () => {
    const renderOrdersPlacedComponent = (props = {}) => {
      return render(
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <Router>
              <ToastProvider>
                <CartProvider>
                  <OrderPlaced {...props} />
                </CartProvider>
              </ToastProvider>
            </Router>
          </QueryClientProvider>
        </Provider>
      );
    };

    test("week8_day5_ordersplaced_component_renders_heading", () => {
      renderOrdersPlacedComponent();

      // check heading
      const heading = screen.getByText(/Orders Placed/i);
      expect(heading).toBeInTheDocument();

    });
    test("week8_day5_ordersplaced_component_renders_search", () => {
      renderOrdersPlacedComponent();
      const searchInput = screen.getByPlaceholderText(/Search orders/i);
      expect(searchInput).toBeInTheDocument();
    });
  });
});

describe("Week8 Day6", () => {
  describe("Signup Component", () => {
  const renderSignupComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <ToastProvider>
              <CartProvider>
                <Signup {...props} />
              </CartProvider>
            </ToastProvider>
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  };

  test("week8_Day6_signup_component_renders_heading", () => {
    renderSignupComponent();
    expect(screen.getByRole("heading", { name: /Readify Market/i })).toBeInTheDocument();
  });
});


  describe("ForgotPassword Component", () => {
  const renderForgotPasswordComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <ToastProvider>
              <CartProvider>
                <ForgotPassword {...props} />
              </CartProvider>
            </ToastProvider>
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  };

  test("week8_Day6_forgotpassword_component_renders_heading", () => {
    renderForgotPasswordComponent();
    expect(screen.getByRole("heading", { name: /Forgot Password/i })).toBeInTheDocument();
  });
});
});

describe("Week9 Day1 — AdminViewReviews Component", () => {
  const renderAdminViewReviewsComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <ToastProvider>
              <CartProvider>
                <AdminViewReviews {...props} />
              </CartProvider>
            </ToastProvider>
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  };

  test("week9_Day1_adminviewreviews_component_renders_heading", () => {
    renderAdminViewReviewsComponent();
    expect(screen.getByRole("heading", { name: /View Reviews/i })).toBeInTheDocument();
  });

  test("week9_Day1_adminviewreviews_component_renders_search_input", () => {
    renderAdminViewReviewsComponent();
    expect(screen.getByPlaceholderText(/search reviews/i)).toBeInTheDocument();
  });
});