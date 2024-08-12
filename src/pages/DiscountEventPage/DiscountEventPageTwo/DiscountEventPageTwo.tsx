import React, { useEffect, useState } from 'react'
import {
  PageContainer,
  Header,
  Title,
  BackButton,
  EventForm,
  Label,
  Textarea,
  MenuTable,
  MenuTableBody,
  MenuRow,
  MenuLabel,
  CheckboxWrapper,
  SubmitButton,
  DiscountDataWrapper,
} from '@pages/DiscountEventPage/DiscountEventPageTwo/DiscountEventPageTwo.style'
import { useNavigate } from 'react-router-dom'
import storeInfoStore from '@stores/storeInfoStore'
import discountEventStore from '@stores/discountEventStore'
import { handleDiscountEventRegister } from '@apis/Discount/discountEventRegister'

export default function DiscountEventPageTwo() {
  const navigate = useNavigate()
  const {
    currentEvent,
    setEventMessage,
    addDiscountEventWithId,
    discountEvents,
  } = discountEventStore()
  const { storeInfos } = storeInfoStore()
  const [selectedMessage, setSelectedMessage] = useState<string>(
    currentEvent.discountTitle,
  )

  const [selectedCheckbox, setSelectedCheckbox] = useState<string | null>(null)

  const handleSelectedMessage = (message: string, checkboxId: string) => {
    setSelectedMessage(message)
    setEventMessage(message)
    setSelectedCheckbox(checkboxId)
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSelectedMessage(e.target.value)
    setEventMessage(e.target.value)
    setSelectedCheckbox(null) // 직접 입력시 체크박스 해제
  }

  const handleSubmit = async () => {
    try {
      const discountInfo = await handleDiscountEventRegister() // 할인 이벤트 API 호출
      if (discountInfo) {
        addDiscountEventWithId(
          discountInfo.discountId,
          discountInfo.storeName,
          discountInfo.title,
          discountInfo.startDate,
          discountInfo.endDate,
          discountInfo.createDiscountMenuDataDtoList,
        )
        //할인 성공적으로 추가 됐으면 성공 여부 따져서 알림 API 호출하는 코드 작성
        console.log(discountEvents)
      }
      navigate('/manager')
    } catch (error) {
      console.error('할인 이벤트 생성 중 오류가 발생했습니다:', error)
      alert('할인 이벤트 생성에 실패했습니다. 다시 시도해주세요.')
    }
  }

  //나중에 사용할 api호출 함수 미리 작성해둠
  /*
    const handleSubmit = async () => {
    addDiscountEvent()
    const eventData = currentEvent
    try {
      const discountData = await axios.post('/임의 주소', eventData)
      console.log(`할인 이벤트가 성공적으로 생성되었습니다. ${discountData}`)
      navigate('/manager')
    } catch (error) {
      console.error('할인 이벤트 생성 중 오류가 발생했습니다:', error)
    }
  }
  */

  return (
    <>
      <PageContainer>
        <Header>
          <BackButton onClick={() => navigate('/discount-event')}>
            &lt;
          </BackButton>
          <Title>할인 행사 진행하기</Title>
        </Header>
        <DiscountDataWrapper>
          <Label>행사 문구</Label>
          <EventForm>
            <Label>직접 입력하기</Label>
            <hr />
            <Textarea
              placeholder="행사 안내 문구를 입력해주세요."
              value={selectedMessage}
              onChange={handleTextareaChange}
            />
            <Label>선택하기</Label>
            <MenuTable>
              <MenuTableBody>
                <MenuRow
                  onClick={() =>
                    handleSelectedMessage(
                      '밥이득 김치찌개 전 메뉴 1000원 할인',
                      'discount1',
                    )
                  }
                >
                  <MenuLabel>밥이득 김치찌개 전 메뉴 1000원 할인</MenuLabel>
                  <CheckboxWrapper>
                    <input
                      type="checkbox"
                      id="discount1"
                      checked={selectedCheckbox === 'discount1'}
                      onChange={() =>
                        handleSelectedMessage(
                          '밥이득 김치찌개 전 메뉴 1000원 할인',
                          'discount1',
                        )
                      }
                    />
                    <label htmlFor="discount1"></label>
                  </CheckboxWrapper>
                </MenuRow>
                <MenuRow
                  onClick={() =>
                    handleSelectedMessage(
                      '밥이득 김치찌개에서 할인행사 합니다!',
                      'discount2',
                    )
                  }
                >
                  <MenuLabel>밥이득 김치찌개에서 할인행사 합니다!</MenuLabel>
                  <CheckboxWrapper>
                    <input
                      type="checkbox"
                      id="discount2"
                      checked={selectedCheckbox === 'discount2'}
                      onChange={() =>
                        handleSelectedMessage(
                          '밥이득 김치찌개에서 할인행사 합니다!',
                          'discount2',
                        )
                      }
                    />
                    <label htmlFor="discount2"></label>
                  </CheckboxWrapper>
                </MenuRow>
              </MenuTableBody>
            </MenuTable>
          </EventForm>
        </DiscountDataWrapper>
      </PageContainer>
      <SubmitButton onClick={handleSubmit}>
        근처 학생들에게 알림 보내기
      </SubmitButton>
    </>
  )
}
