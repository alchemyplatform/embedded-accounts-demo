import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

type Props = {
  onSubmit: (email: string) => void | Promise<void>;
  buttonCta?: string;
  buttonDisabled?: boolean;
};

const EmailForm = ({ onSubmit, buttonDisabled }: Props) => {
  const form = useForm({
    defaultValues: {
      email: "",
    },
    validatorAdapter: zodValidator,
    onSubmit: ({ value }) => onSubmit(value.email),
  });

  return (
    <form.Provider>
      <form
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "16px",
          width: "100%",
        }}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <form.Field
          name="email"
          validators={{
            onBlur: z.string().email("Please enter a valid email"),
          }}
        >
          {(field) => (
            <label className="form-control w-full max-w-xs">
              <input
                className="input input-bordered w-full max-w-xs"
                type="email"
                placeholder="email"
                name={field.name}
                value={field.state.value ?? ""}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </label>
          )}
        </form.Field>
        <form.Subscribe>
          {({ canSubmit, isSubmitting }) => (
            <button
              className="btn"
              disabled={!canSubmit || isSubmitting || buttonDisabled}
              type="submit"
            >
              Submit
            </button>
          )}
        </form.Subscribe>
      </form>
    </form.Provider>
  );
};

export default EmailForm;
