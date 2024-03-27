
const FormInput = ({ label, inputOptions, placeholder }) => {
  return (
    <div className="group m-5 text-left">
      <input
        placeholder={placeholder}
        className="form-input pl-2 bg-transparent bg-gray-100 border text-blue-nova text-sm block lg:w-[300px] w-full focus:outline-none rounded h-9"
        {...inputOptions}
      />
    </div>
  );
};
export default FormInput;
