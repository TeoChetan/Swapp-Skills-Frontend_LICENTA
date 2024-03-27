import { Fragment } from "react";

export const Spinner = () => {
    return (
      <Fragment>
        <div className="fixed inset-0 bg-polar-sky bg-opacity-60 z-50 flex justify-center items-center">
          <div className="spinner-border" role="status"></div>
        </div>
        <style jsx>
          {`
            .spinner-border {
              width: 100px;
              height: 100px;
              border-radius: 50%;
              position: relative;
              animation: spin 1s linear infinite;
            }
            .spinner-border::after {
              content: '';
              box-sizing: border-box;
              position: absolute;
              width: 100%;
              height: 100%;
              border-radius: 50%;
              left: 0;
              top: 0;
              border: 8px solid transparent;
              border-top-color: #3490dc; 
              border-bottom-color: #6574cd;
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              to {
                transform: rotate(360deg);
              }
            }
          `}
        </style>
    </Fragment>
    );
  };
  