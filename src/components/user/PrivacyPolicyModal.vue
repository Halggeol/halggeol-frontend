<script setup>
import { ref, onMounted } from 'vue';

const privacyHtml = ref('');

const privacyText = `이때 할 걸(이하 "회사")은 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같은 개인정보 처리방침을 수립·공개합니다.

제1조(개인정보의 수집 항목 및 수집 방법)
회사는 다음의 개인정보를 수집하며, 수집 시점에 이용자로부터 별도의 동의를 받습니다.

1. 회원 가입 및 서비스 이용 시
- 필수 항목: 이름, 이메일, 생년월일, 전화번호

2. 마이데이터 서비스 이용 시
- 선택 항목: 마이데이터 연계를 통한 개인 금융정보
- ※ 마이데이터 정보는 별도의 동의 절차를 거쳐 수집되며, 본 방침과는 별도로 고지 및 관리됩니다.

제2조(개인정보의 수집 및 이용 목적)
회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.

1. 회원 가입 및 관리
- 이용자 식별 및 본인 확인
- 회원제 서비스 제공 및 유지

2. 마이데이터 서비스 제공
- 사용자 맞춤 금융 분석 및 인사이트 제공
- 마이데이터 기반 금융 정보 통합 조회

제3조(개인정보의 보유 및 이용 기간)
회사는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.

- 보유 기간: 회원 탈퇴 시 즉시 파기

제4조(개인정보의 제3자 제공)
회사는 원칙적으로 정보주체의 개인정보를 제3자에게 제공하지 않습니다.
단, 다음의 경우에는 예외로 합니다.
- 정보주체의 사전 동의를 받은 경우
- 법령에 의하여 제출 의무가 있는 경우

제5조(개인정보의 파기 절차 및 방법)
회사는 수집된 개인정보의 처리 목적이 달성된 후에는 내부 방침 및 관련 법령에 따라 지체 없이 안전하게 파기합니다.

1. 파기 절차: 이용자의 탈퇴 요청 시 내부 검토 후 즉시 파기
2. 파기 방법: 전자적 파일 형태는 복구 불가능한 방식으로 영구 삭제

본 방침은 2025년 8월 4일부터 적용됩니다.`;

onMounted(() => {
  privacyHtml.value = privacyText.replace(/\n/g, '<br>');
});
</script>

<template>
  <dialog id="policy_modal" class="modal">
    <div class="modal-box max-w-2xl max-h-[80vh] overflow-y-auto">
      <h3 class="font-bold text-xl mb-4">개인정보 처리방침</h3>
      <div v-html="privacyHtml" class="text-sm leading-relaxed whitespace-pre-line"></div>
      <div class="modal-action mt-4">
        <form method="dialog">
          <button class="btn btn-sm btn-primary">닫기</button>
        </form>
      </div>
    </div>
  </dialog>
</template>
