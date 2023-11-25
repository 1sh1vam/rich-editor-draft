const Button = (props: React.HTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className="justify-self-end bg-[#00ED64] border border-[#00684A] text-[#001E2B] py-4 px-8 font-medium rounded hover:rounded-full leading-4"
      {...props}
    />
  );
};

export default Button;
