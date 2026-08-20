"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BottomTabBar } from "@/components/BottomTabBar";
import { Button } from "@/components/Button";
import { InspectionNavigation } from "@/components/InspectionNavigation";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import {
  getApiErrorMessage,
  getRoleInspectionPeople,
  resendConfirmerAcceptanceEmail,
  resendRecipientAcceptanceEmail,
} from "@/lib/api";
import { showSnackbar } from "@/lib/ui/snackbar";

function RoleContent() {
  const searchParams = useSearchParams();
  const requested = searchParams.get("person");
  const requestedType = searchParams.get("type");
  const [people, setPeople] = useState<Awaited<ReturnType<typeof getRoleInspectionPeople>>>([]);
  const [selectedId, setSelectedId] = useState<string | null>(requested);
  const [errorMessage, setErrorMessage] = useState("");
  const [resendPending, setResendPending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [fitsDesktopRow, setFitsDesktopRow] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    getRoleInspectionPeople()
      .then((next) => {
        setPeople(next);
        setSelectedId((current) => {
          if (next.some((person) => person.id === current)) return current;
          if (requestedType === "verifier") return next.find((person) => person.type === "verifier")?.id ?? next[0]?.id ?? null;
          if (requestedType === "manager") return next.find((person) => person.type !== "verifier")?.id ?? next[0]?.id ?? null;
          return next[0]?.id ?? null;
        });
      })
      .catch((error: unknown) => setErrorMessage(error instanceof Error ? error.message : "역할 정보를 불러오지 못했습니다."));
  }, [requestedType]);
  useEffect(() => {
    const selector = selectorRef.current;
    if (!selector) return;

    const measure = () => {
      const buttons = Array.from(selector.querySelectorAll("button"));
      const itemWidth = buttons.reduce((total, button) => {
        const styles = window.getComputedStyle(button);
        const label = document.createRange();
        label.selectNodeContents(button);
        return total + label.getBoundingClientRect().width
          + Number.parseFloat(styles.paddingLeft) + Number.parseFloat(styles.paddingRight)
          + Number.parseFloat(styles.borderLeftWidth) + Number.parseFloat(styles.borderRightWidth);
      }, 0);
      const gap = Number.parseFloat(window.getComputedStyle(selector).columnGap) || 0;
      const requiredWidth = itemWidth + gap * Math.max(buttons.length - 1, 0) + 8;
      const availableWidth = Math.min(window.innerWidth - 240, 460);
      setFitsDesktopRow(window.innerWidth >= 1024 && requiredWidth <= availableWidth);
    };

    measure();
    const observer = new ResizeObserver(measure);
    Array.from(selector.children).forEach((item) => observer.observe(item));
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [people]);
  const person = people.find((item) => item.id === selectedId) ?? people[0];
  if (!person) return <PageContainer className="pt-[70px] text-center text-sm text-[#796b6c]">{errorMessage || "역할 정보를 불러오는 중입니다."}</PageContainer>;
  const verifier = person.type === "verifier";
  const managers = people.filter((item) => item.type !== "verifier");
  const verifiers = people.filter((item) => item.type === "verifier");

  const personButton = (item: (typeof people)[number]) => (
    <button
      className={`min-w-0 flex-1 whitespace-nowrap rounded-[16px] px-3 py-3 text-[13px] font-medium leading-none transition-colors min-[380px]:px-[18px] md:text-[15px] ${item.id === person.id ? "border-[1.4px] border-[#43306d] bg-[#e2dafa] text-[#43306d]" : "border-[1.4px] border-transparent bg-[#f3f3ff] text-[#a99d9e]"}`}
      key={item.id}
      onClick={() => { setSelectedId(item.id); setResendMessage(""); }}
      type="button"
    >
      {item.name}
    </button>
  );

  const handleResend = async () => {
    if (resendPending) return;
    setResendPending(true);
    setResendMessage("");
    try {
      if (verifier) await resendConfirmerAcceptanceEmail(person.id);
      else await resendRecipientAcceptanceEmail(person.id);
      setResendMessage("수락 요청 이메일을 다시 보냈습니다.");
      showSnackbar("수락 요청 이메일을 다시 보냈습니다.");
    } catch (error) {
      setResendMessage(getApiErrorMessage(error, "수락 요청 이메일을 다시 보내지 못했습니다."));
    } finally {
      setResendPending(false);
    }
  };

  return (
    <PageContainer className="role-preview gap-3 pb-[100px] pt-[70px] lg:max-w-none lg:px-[120px] lg:pb-20 lg:pt-0">
      <PageHeader className="items-center px-1 py-2 md:px-0 md:py-0" title="역할 점검" />
      <div className="mx-auto flex w-full max-w-[342px] flex-col gap-[30px] pt-1 md:max-w-[460px] md:pt-[18px]">
        <InspectionNavigation active="role" />
        <section className="flex flex-col gap-10 pb-5">
        <div
          className={`flex w-full items-center gap-2 px-1 lg:self-center ${fitsDesktopRow ? "flex-nowrap" : "flex-wrap"}`}
          ref={selectorRef}
          role="group"
          aria-label="역할 담당자 및 지정 확인자 선택"
        >
          {managers.length > 0 && (
            <div className={`flex items-center gap-2 ${fitsDesktopRow ? "min-w-0 flex-1" : "w-full"}`} style={fitsDesktopRow ? { flexGrow: managers.length } : undefined} role="group" aria-label="역할 담당자 선택">
              {managers.map(personButton)}
            </div>
          )}
          {verifiers.length > 0 && (
            <div className={`flex items-center gap-2 ${fitsDesktopRow ? "min-w-0 flex-1" : "w-full"}`} style={fitsDesktopRow ? { flexGrow: verifiers.length } : undefined} role="group" aria-label="지정 확인자 선택">
              {verifiers.map(personButton)}
            </div>
          )}
        </div>
        <article className="flex flex-col gap-[30px] rounded-[20px] bg-white px-5 pb-[22px] pt-[30px] md:px-[26px]">
          <div className="flex flex-col gap-3 text-[#43306d]">
            <div className="flex justify-between">
              <h2 className="whitespace-nowrap text-lg font-bold md:text-xl">{person.name}님</h2>
              <span className="text-sm font-bold text-[#796b6c] md:text-base">{person.status}</span>
            </div>
            <p className="text-sm font-medium text-[#796b6c] md:text-[15px]">{person.email}</p>
          </div>
          <div className={verifier ? "flex flex-col gap-5" : "grid grid-cols-2 items-start pb-1.5"}>
            <section className={`flex min-w-0 flex-col gap-2.5 ${verifier ? "" : "pr-[18px] md:pr-[30px]"}`}>
              <h3 className="text-sm font-bold text-[#43306d] md:text-base">{person.role}</h3>
              <p className="text-[13px] font-medium text-[#796b6c] md:text-[15px]">{person.summary}</p>
            </section>
            {!verifier && (
              <section className="flex shrink-0 flex-col justify-center gap-2.5 border-l-[1.4px] border-[#e2dafa] pl-[18px] md:pl-[30px]">
                <h3 className="text-sm font-bold text-[#43306d] md:text-base">대기 기간</h3>
                <p className="text-[13px] font-medium text-[#796b6c] md:text-[15px]">{person.waitingPeriod}</p>
              </section>
            )}
          </div>
          {verifier ? (
            <div className="rounded-[20px] bg-[#eeecee] p-5">
              <strong className="text-sm text-[#43306d] md:text-base">사망 확인 날짜</strong>
              <p className="mt-2.5 text-[13px] font-medium text-[#584e4d] lg:hidden">사용자의 사망 날짜가 확인되면 볼 수 있어요</p>
              <p className="mt-2.5 hidden text-[15px] font-medium text-[#584e4d] lg:block">사용자의 사망이 확인되고 날짜가 등록되면 확인 가능해요</p>
            </div>
          ) : (
            person.groups?.map((group) => (
              <section className="flex flex-col gap-4" key={group.title}>
                <h3 className="px-2.5 text-sm font-bold text-[#43306d] md:text-base">{group.title}</h3>
                {group.tasks.map(([title, description]) => (
                  <div className="rounded-[20px] bg-[#eeecee] p-5" key={title}>
                    <strong className="text-sm text-[#43306d] md:text-base">{title}</strong>
                    <p className="mt-2 text-[13px] font-medium text-[#584e4d] md:text-[15px]">{description}</p>
                  </div>
                ))}
              </section>
            ))
          )}
        </article>
        </section>
        <div className="flex flex-col gap-[26px]">
          {resendMessage && <p className="text-center text-sm text-[#796b6c]" role="status">{resendMessage}</p>}
          <Button className="!text-sm md:!text-base" disabled={resendPending} onClick={handleResend} type="button">{resendPending ? "전송 중..." : "수락 요청 다시 보내기"}</Button>
          <Button className="bg-[#7f62b8] !text-sm hover:!bg-[#6f54a5] md:!text-base" href={`${verifier ? "/role/verifier/edit" : "/role/manager/edit"}?id=${encodeURIComponent(person.id)}`}>
            {verifier ? "확인자 수정하기" : "담당자 수정하기"}
          </Button>
        </div>
      </div>
      <BottomTabBar activeTab="inspection" />
    </PageContainer>
  );
}

export default function RoleInspectionPage() {
  return <Suspense fallback={null}><RoleContent /></Suspense>;
}
