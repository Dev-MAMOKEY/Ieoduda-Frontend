import Link from "next/link";

export default function RestrictedInfoPage() {
  return (
    <main
      className="mx-auto flex min-h-dvh w-full max-w-[390px] items-center justify-center bg-[#f0f0f2] px-6 py-[70px] text-[#28292e]"
      data-node-id="439:1165"
    >
      <section
        className="flex w-full max-w-[340px] flex-col items-center justify-center gap-6 overflow-hidden rounded-[30px] bg-white px-6 pb-[30px] pt-10"
        data-node-id="439:1166"
      >
        <div className="flex flex-col items-center gap-3 whitespace-nowrap text-center">
          <h1 className="text-base font-bold">금지정보 안내</h1>
          <div className="flex flex-col gap-1.5 text-sm font-medium text-[#838383]">
            <p>비밀번호를 적지 마세요.</p>
            <p>계정 이름, 자료위치의 유형과</p>
            <p>원하는 처리 결과만 작성합니다.</p>
          </div>
        </div>

        <Link
          className="flex h-[45px] w-full items-center justify-center rounded-[20px] bg-[#a8a8a8] px-5 text-sm text-white transition-colors hover:bg-[#929292] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#838383]"
          href="/agreement"
        >
          확인
        </Link>
      </section>
    </main>
  );
}
