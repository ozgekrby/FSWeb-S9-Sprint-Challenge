import axios from 'axios'
import React, { useEffect, useState } from 'react'

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

  // AŞAĞIDAKİ HELPERLAR SADECE ÖNERİDİR.
  // Bunları silip kendi mantığınızla sıfırdan geliştirebilirsiniz.

  function getXY() {
 
    // Koordinatları izlemek için bir state e sahip olmak gerekli değildir.
    // Bunları hesaplayabilmek için "B" nin hangi indexte olduğunu bilmek yeterlidir.
   const xy={row:Math.floor(index / 3) + 1,column:(index % 3) + 1};
   return xy;
  }

  function getXYMesaj() {
    // Kullanıcı için "Koordinatlar (2, 2)" mesajını izlemek için bir state'in olması gerekli değildir.
    // Koordinatları almak için yukarıdaki "getXY" helperını ve ardından "getXYMesaj"ı kullanabilirsiniz.
    // tamamen oluşturulmuş stringi döndürür.
    const {row,column}=getXY();
    return `Koordinatlar (${column}, ${row})`
  }

  function reset() {
    // Tüm stateleri başlangıç ​​değerlerine sıfırlamak için bu helperı kullanın.
    setIndex(initialIndex)
    setEmail(initialEmail)
    setSteps(initialSteps)
    setMessage(initialMessage)
  }

  function sonrakiIndex(yon) {
    const {row,column}=getXY();
    // Bu helper bir yön ("sol", "yukarı", vb.) alır ve "B" nin bir sonraki indeksinin ne olduğunu hesaplar.
    // Gridin kenarına ulaşıldığında başka gidecek yer olmadığı için,
    // şu anki indeksi değiştirmemeli.
    if(yon==="up"&&row>1){
      return index-3
      
    }else if(yon==="up"&&row<=1){
      setMessage("Yukarıya gidemezsiniz")
    }
    else if(yon==="down"&&row<3){
      return index+3
    }else if(yon==="down"&&row>=3){
      setMessage("Aşağıya gidemezsiniz")
    }
    else if(yon==="left"&&column>1){
      return index-1
    }else if(yon==="left"&&column<=1){
      setMessage("Sola gidemezsiniz")
    }
    else if(yon==="right"&&column<3){
        return index+1
    }else if(yon==="right"&&column>=3){
        setMessage("Sağa gidemezsiniz")
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

    }
  }

  function onChange(evt) {
    // inputun değerini güncellemek için bunu kullanabilirsiniz
    setEmail(evt.target.value);
  }

  function onSubmit(evt) {
    const {row,column}=getXY();
    // payloadu POST etmek için bir submit handlera da ihtiyacınız var.
    evt.preventDefault();
  
 axios.post('http://localhost:9000/api/result', { "x": column, "y": row, "steps": steps, "email": email })
    .then(function (response) {
      console.log(response);
      setMessage(response.data.message);

    })
    .catch(function (error) {
      console.log(error);
      console.log(error.response.message);
      setMessage(error.response.data.message);
    });
    setEmail(initialEmail)
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
        <input id="email" type="email" placeholder="email girin" onChange={onChange} value={email}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
