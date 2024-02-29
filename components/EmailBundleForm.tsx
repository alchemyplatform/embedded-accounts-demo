import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";

type Props = {
  onSubmit: (bundle: string) => void | Promise<void>;
  buttonCta?: string;
  buttonDisabled?: boolean;
};

const EmailBundleForm = ({ onSubmit, buttonDisabled }: Props) => {
  const form = useForm({
    defaultValues: {
      bundle: "",
    },
    validatorAdapter: zodValidator,
    onSubmit: ({ value }) => onSubmit(value.bundle),
  });

  return <div>Check your email and click the link to complete login</div>;
};

export default EmailBundleForm;
