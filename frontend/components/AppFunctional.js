import React, { useState } from 'react'

// önerilen başlangıç stateleri
const initialMessage =""
const initialEmail = ""
const initialSteps = 0
const initialIndex = 4 //  "B" nin bulunduğu indexi

export default function AppFunctional(props) {
  const [message, setMessage] = useState(initialMessage)
  const [email, setEmail] = useState(initialEmail)
  const [steps, setSteps] = useState(initialSteps)
  const [index, setIndex] = useState(initialIndex) 

  const row = Math.floor(index / 3) + 1;
  const column = (index % 3) + 1; 

  // AŞAĞIDAKİ HELPERLAR SADECE ÖNERİDİR.
  // Bunları silip kendi mantığınızla sıfırdan geliştirebilirsiniz.

  function getXY() {
    // Koordinatları izlemek için bir state e sahip olmak gerekli değildir.
    // Bunları hesaplayabilmek için "B" nin hangi indexte olduğunu bilmek yeterlidir.
   const xy={row,column};
   return xy;
  }

  function getXYMesaj() {
    // Kullanıcı için "Koordinatlar (2, 2)" mesajını izlemek için bir state'in olması gerekli değildir.
    // Koordinatları almak için yukarıdaki "getXY" helperını ve ardından "getXYMesaj"ı kullanabilirsiniz.
    // tamamen oluşturulmuş stringi döndürür.
    const koordinat=getXY();
    return `Koordinatlar (${row},${column})`
  }

  function reset() {
    // Tüm stateleri başlangıç ​​değerlerine sıfırlamak için bu helperı kullanın.
    setIndex(initialIndex)
    setEmail(initialEmail)
    setSteps(initialSteps)
    setMessage(initialMessage)
  }

  function sonrakiIndex(yon) {
    // Bu helper bir yön ("sol", "yukarı", vb.) alır ve "B" nin bir sonraki indeksinin ne olduğunu hesaplar.
    // Gridin kenarına ulaşıldığında başka gidecek yer olmadığı için,
    // şu anki indeksi değiştirmemeli.
    if(yon==="up"&&row>1){
      return index-3
      
    }
    if(yon==="down"&&row<3){
      return index+3
    }
    if(yon==="left"&&column>1){
      return index-1
    }
    if(yon==="right"&&column<3){
        return index+1
      }
return index;
  }

  function ilerle(evt) {
    // Bu event handler, "B" için yeni bir dizin elde etmek üzere yukarıdaki yardımcıyı kullanabilir,
    // ve buna göre state i değiştirir.
    const yon=evt.target.id;
    const gunceIndex=sonrakiIndex(yon);
    if(gunceIndex!==index){
      setIndex(gunceIndex);
      setSteps(prevsteps=>prevsteps+1);
      setMessage(initialMessage);
    }else{
      setMessage("Daha fazla ilerleyemezsiniz.")
    }
  }

  function onChange(evt) {
    // inputun değerini güncellemek için bunu kullanabilirsiniz
    setEmail(evt.target.value);
  }

  function onSubmit(evt) {
    // payloadu POST etmek için bir submit handlera da ihtiyacınız var.
    evt.preventDefault();
    const emailString = email.indexOf('@');
    if(email===""){
      setMessage("Ouch: email must be a valid email")
    }else{
      setMessage(email.slice(0, emailString))
    }
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates" data-testid="coordinates">{getXYMesaj()}</h3>
        <h3 id="steps">{steps} kere ilerlediniz</h3>
      </div>
      <div id="grid">
      {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
       <h3 id="message">{message}</h3>
        
      </div>
      <div id="keypad">
        <button id="left" onClick={ilerle}>SOL</button>
        <button id="up" onClick={ilerle} >YUKARI</button>
        <button id="right" onClick={ilerle} >SAĞ</button>
        <button id="down" onClick={ilerle} >AŞAĞI</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="email girin" onChange={onChange}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
