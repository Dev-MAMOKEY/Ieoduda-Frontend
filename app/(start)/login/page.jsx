"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";

const fields = [
  {
    id: "email",
    label: "이메일",
    type: "email",
    autoComplete: "email",
    placeholder: "이메일을 입력해주세요",
  },
  {
    id: "password",
    label: "비밀번호",
    type: "password",
    autoComplete: "current-password",
    placeholder: "비밀번호를 입력해주세요",
  },
];

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = (event) => {
    event.preventDefault();
    router.push("/service-info");
  };

  return (
    <main
      className="mx-auto flex min-h-dvh w-full max-w-[390px] items-center bg-[#f0f0f2] px-6 py-[70px] text-[#28292e]"
      data-node-id="439:1136"
    >
      <form className="flex w-full flex-col gap-5" onSubmit={handleSubmit}>
        <h1 className="text-[22px] font-bold leading-normal">로그인</h1>

        {fields.map((field) => (
          <div className="flex w-full flex-col gap-2" key={field.id}>
            <label className="px-2.5 text-base font-semibold" htmlFor={field.id}>
              {field.label}
            </label>
            <input
              className="h-[41px] w-full rounded-[20px] border-0 bg-white px-5 text-sm outline-none placeholder:text-[#a8a8a8] focus-visible:ring-2 focus-visible:ring-[#a8a8a8]/50"
              id={field.id}
              name={field.id}
              type={field.type}
              autoComplete={field.autoComplete}
              placeholder={field.placeholder}
            />
          </div>
        ))}

        <Button type="submit">
          로그인하기
        </Button>

        <p className="flex w-full items-center justify-center gap-2 text-sm whitespace-nowrap">
          <span className="text-[#a8a8a8]">아직 회원이 아니신가요?</span>
          <Link className="underline underline-offset-2" href="/signup">
            회원가입하기
          </Link>
        </p>
      </form>
    </main>
  );
}
