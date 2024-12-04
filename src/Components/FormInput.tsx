import { FormProps } from "../Types/interfaces";
const FormInput = (props: FormProps) => {
  return (
    <div className="flex flex-row items-center h-1/4 w-full">
      {" "}
      <img
        src={props.imgSrc}
        className="border-2 h-8 w-8 bg-white border-white rounded-xl text-center mx-2 object-cover"
      />
      <input
        placeholder={props.placeholder}
        type={props.type}
        value={props.value}
        onChange={props.onChange}
        className="bg-none outline-none p-5 rounded-xl text-black h-1/2 w-4/5"
      />{" "}
    </div>
  );
};

export default FormInput;
