import { useEffect, useMemo, useState } from 'react'
import logo from './assets/logo.jpg'
import fachada from './assets/fachada.jpg'
import { loja, horarios, oficina, balcao, duvidas } from './data.js'

const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const ORDEM = [1, 2, 3, 4, 5, 6, 0]

function agoraEmOuroPreto() {
  const s = new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })
  return new Date(s)
}

function useStatus() {
  const [agora, setAgora] = useState(agoraEmOuroPreto)
  useEffect(() => {
    const t = setInterval(() => setAgora(agoraEmOuroPreto()), 60000)
    return () => clearInterval(t)
  }, [])
  return useMemo(() => {
    const dia = agora.getDay()
    const hora = agora.getHours() + agora.getMinutes() / 60
    const hoje = horarios[dia]
    if (hoje && hora >= hoje[0] && hora < hoje[1]) {
      return { dia, aberto: true, texto: `Aberto agora, fecha às ${hoje[1]}h` }
    }
    if (hoje && hora < hoje[0]) {
      return { dia, aberto: false, texto: `Fechado agora, abre hoje às ${hoje[0]}h` }
    }
    let n = dia
    let passos = 0
    do { n = (n + 1) % 7; passos++ } while (!horarios[n] && passos < 7)
    const quando = passos === 1 ? 'amanhã' : DIAS[n].toLowerCase()
    return { dia, aberto: false, texto: `Fechado agora, abre ${quando} às ${horarios[n][0]}h` }
  }, [agora])
}

function linkWhats(texto) {
  return `https://wa.me/${loja.whatsappNumero}?text=${encodeURIComponent(texto)}`
}

function Cabecalho() {
  return (
    <header className="cabecalho">
      <div className="cabecalho__in">
        <a href="#inicio" className="cabecalho__logo" aria-label="Dakura Motos, início">
          <img src={logo} alt="Dakura Motos" width="64" height="64" />
        </a>
        <nav className="cabecalho__nav" aria-label="Seções">
          <a href="#servicos">Serviços</a>
          <a href="#pedido">Orçamento</a>
          <a href="#duvidas">Dúvidas</a>
          <a href="#contato">Como chegar</a>
        </nav>
        <a className="botao botao--amarelo cabecalho__cta" href={linkWhats('Olá! Vim pelo site da Dakura Motos.')} target="_blank" rel="noopener">
          WhatsApp
        </a>
      </div>
    </header>
  )
}

const LADEIRA = 'M0 190 L120 170 L210 120 L300 140 L420 70 L520 95 L610 40 L720 88 L830 60 L940 130 L1050 100 L1160 150 L1280 110 L1440 160'

function Abertura({ status }) {
  return (
    <section className="abertura" id="inicio">
      <div className="abertura__in">
        <h1>Em Ouro Preto, moto vive na ladeira.</h1>
        <p className="abertura__lede">
          Freio, embreagem e corrente trabalham dobrado aqui. A Dakura cuida disso desde {loja.desde}:
          oficina multimarcas, peças, acessórios e motos seminovas na Av. JK, 800.
        </p>
        <div className="abertura__acoes">
          <a className="botao botao--amarelo" href={linkWhats('Olá! Gostaria de um orçamento para a minha moto.')} target="_blank" rel="noopener">
            Pedir orçamento no WhatsApp
          </a>
          <a className="botao botao--claro" href={loja.mapa} target="_blank" rel="noopener">
            Ver no mapa
          </a>
        </div>
        <p className={`status status--claro ${status.aberto ? 'status--aberto' : ''}`}>
          <span className="status__ponto" aria-hidden="true" />
          {status.texto}
        </p>
      </div>
      <div className="ladeira" aria-hidden="true">
        <svg viewBox="0 0 1440 220" preserveAspectRatio="none">
          <path className="ladeira__chao" d={`${LADEIRA} L1440 220 L0 220 Z`} />
          <path className="ladeira__linha" d={LADEIRA} pathLength="1" />
        </svg>
        <span className="ladeira__pino">Dakura, Av. JK 800</span>
      </div>
    </section>
  )
}

function Faixa() {
  return (
    <div className="faixa">
      <div className="faixa__in">
        <p className="faixa__slogan">{loja.slogan}</p>
        <dl className="faixa__dados">
          <div><dt>Endereço</dt><dd>Av. JK, 800, Bauxita</dd></div>
          <div><dt>Telefone</dt><dd><a href={loja.telefoneLink}>{loja.telefone}</a></dd></div>
          <div><dt>WhatsApp</dt><dd>{loja.whatsapp}</dd></div>
        </dl>
      </div>
    </div>
  )
}

function Lista({ titulo, itens }) {
  return (
    <div className="placa__coluna">
      <h3>{titulo}</h3>
      <ul>
        {itens.map((i) => (
          <li key={i.titulo}>
            <strong>{i.titulo}</strong>
            <span>{i.texto}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Servicos() {
  return (
    <section className="secao" id="servicos">
      <div className="secao__in">
        <div className="secao__topo">
          <h2>O que a gente faz</h2>
          <p>Diagnóstico, peça e mão de obra no mesmo lugar. Você não precisa rodar a cidade atrás de cada coisa.</p>
        </div>
        <div className="placa">
          <Lista titulo="Na oficina" itens={oficina} />
          <Lista titulo="No balcão" itens={balcao} />
        </div>
      </div>
    </section>
  )
}

const TIPOS = [
  { id: 'servico', rotulo: 'Serviço na moto' },
  { id: 'peca', rotulo: 'Peça ou acessório' },
  { id: 'seminova', rotulo: 'Moto à venda' },
]

function Pedido() {
  const [tipo, setTipo] = useState('servico')
  const [moto, setMoto] = useState('Honda CG 160')
  const [ano, setAno] = useState('2019')
  const [detalhe, setDetalhe] = useState('')
  const [entrega, setEntrega] = useState('retirar')

  const exemplos = {
    servico: 'Ex.: barulho na corrente e freio traseiro fraco',
    peca: 'Ex.: kit relação e pastilha de freio dianteira',
    seminova: 'Ex.: procuro uma 160 até R$ 15 mil',
  }

  const mensagem = useMemo(() => {
    const motoTxt = [moto.trim(), ano.trim()].filter(Boolean).join(', ')
    const linhas = ['Olá, Dakura! Vim pelo site.']
    if (tipo === 'servico') {
      linhas.push(`Quero um orçamento de serviço${motoTxt ? ` para a minha ${motoTxt}` : ''}.`)
    } else if (tipo === 'peca') {
      linhas.push(`Quero fazer um pedido de peças${motoTxt ? ` para a ${motoTxt}` : ''}.`)
    } else {
      linhas.push('Quero saber das motos que vocês têm à venda.')
    }
    if (detalhe.trim()) linhas.push(detalhe.trim())
    if (tipo === 'peca') {
      linhas.push(entrega === 'entregar' ? 'Prefiro receber em casa.' : 'Vou retirar na loja.')
    }
    return linhas.join('\n')
  }, [tipo, moto, ano, detalhe, entrega])

  return (
    <section className="secao secao--clara" id="pedido">
      <div className="secao__in pedido">
        <div className="pedido__intro">
          <h2>Monte o seu pedido pelo WhatsApp</h2>
          <p>
            Preencha o básico e o site escreve a mensagem para você. A gente confere o estoque, passa o
            valor e combina a entrega ou a retirada na loja.
          </p>
        </div>

        <form className="pedido__form" onSubmit={(e) => e.preventDefault()}>
          <fieldset className="opcoes">
            <legend>O que você precisa?</legend>
            {TIPOS.map((t) => (
              <label key={t.id} className={`opcao ${tipo === t.id ? 'opcao--ativa' : ''}`}>
                <input type="radio" name="tipo" id={`tipo-${t.id}`} value={t.id} checked={tipo === t.id} onChange={() => setTipo(t.id)} />
                {t.rotulo}
              </label>
            ))}
          </fieldset>

          {tipo !== 'seminova' && (
            <div className="campos-linha">
              <label className="campo">
                <span>Modelo da moto</span>
                <input id="moto" value={moto} onChange={(e) => setMoto(e.target.value)} placeholder="Ex.: Yamaha Fazer 250" />
              </label>
              <label className="campo campo--curto">
                <span>Ano</span>
                <input id="ano" inputMode="numeric" value={ano} onChange={(e) => setAno(e.target.value)} placeholder="2018" />
              </label>
            </div>
          )}

          <label className="campo">
            <span>{tipo === 'seminova' ? 'O que você procura?' : 'Conte o que está acontecendo ou o que precisa'}</span>
            <textarea id="detalhe" rows="3" value={detalhe} onChange={(e) => setDetalhe(e.target.value)} placeholder={exemplos[tipo]} />
          </label>

          {tipo === 'peca' && (
            <fieldset className="opcoes opcoes--pequenas">
              <legend>Entrega ou retirada?</legend>
              <label className={`opcao ${entrega === 'retirar' ? 'opcao--ativa' : ''}`}>
                <input type="radio" name="entrega" id="entrega-retirar" checked={entrega === 'retirar'} onChange={() => setEntrega('retirar')} />
                Retiro na loja
              </label>
              <label className={`opcao ${entrega === 'entregar' ? 'opcao--ativa' : ''}`}>
                <input type="radio" name="entrega" id="entrega-entregar" checked={entrega === 'entregar'} onChange={() => setEntrega('entregar')} />
                Quero receber
              </label>
            </fieldset>
          )}
        </form>

        <div className="pedido__previa">
          <p className="pedido__rotulo">Sua mensagem</p>
          <p className="balao">{mensagem}</p>
          <a className="botao botao--azul botao--largo" href={linkWhats(mensagem)} target="_blank" rel="noopener">
            Enviar pelo WhatsApp
          </a>
          <p className="pedido__nota">Abre o WhatsApp com a mensagem pronta para o {loja.whatsapp}.</p>
        </div>
      </div>
    </section>
  )
}

function Historia() {
  const vagas = ['A oficina em ação', 'O balcão de peças', 'A equipe']
  return (
    <section className="secao" id="historia">
      <div className="secao__in historia">
        <div className="historia__texto">
          <h2>Na Av. JK desde {loja.desde}</h2>
          <p>
            A Dakura abriu as portas em {loja.desde} e, desde então, cuida das motos de quem trabalha,
            estuda e passeia por Ouro Preto e região. Ladeira, calçamento e serra pedem freio, embreagem
            e suspensão em dia, e é isso que a gente faz todos os dias.
          </p>
          <p>
            A equipe acompanha a evolução das motos e já foi parceira do curso de mecânicos de
            motocicleta da cidade.
          </p>
        </div>
        <div className="galeria">
          <img className="galeria__principal" src={fachada} alt="Motos em frente à Dakura Motos" loading="lazy" />
          {vagas.map((v) => (
            <div key={v} className="galeria__vaga">
              <img src={logo} alt="" aria-hidden="true" />
              <span>Foto em breve: {v.toLowerCase()}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Duvidas() {
  return (
    <section className="secao secao--clara" id="duvidas">
      <div className="secao__in duvidas">
        <h2>Perguntas que a gente mais ouve</h2>
        <div className="duvidas__lista">
          {duvidas.map((d) => (
            <details key={d.p}>
              <summary>{d.p}</summary>
              <p>{d.r}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contato({ status }) {
  return (
    <section className="secao secao--azul" id="contato">
      <div className="secao__in contato">
        <div>
          <h2>Como chegar</h2>
          <address className="contato__end">
            {loja.endereco}<br />
            {loja.bairro}<br />
            <span>{loja.referencia}</span>
          </address>
          <div className="abertura__acoes">
            <a className="botao botao--amarelo" href={loja.mapa} target="_blank" rel="noopener">Traçar rota no Google Maps</a>
          </div>
          <dl className="contato__dados">
            <div><dt>Telefone</dt><dd><a href={loja.telefoneLink}>{loja.telefone}</a></dd></div>
            <div><dt>WhatsApp</dt><dd><a href={linkWhats('Olá! Vim pelo site da Dakura Motos.')} target="_blank" rel="noopener">{loja.whatsapp}</a></dd></div>
            <div><dt>E-mail</dt><dd><a href={`mailto:${loja.email}`}>{loja.email}</a></dd></div>
          </dl>
        </div>
        <div>
          <h2>Horário</h2>
          <table className="horario">
            <tbody>
              {ORDEM.map((d) => (
                <tr key={d} className={d === status.dia ? 'horario--hoje' : ''}>
                  <th scope="row">{DIAS[d]}{d === status.dia ? ' (hoje)' : ''}</th>
                  <td>{horarios[d] ? `${horarios[d][0]}h às ${horarios[d][1]}h` : 'Fechado'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={`status status--claro ${status.aberto ? 'status--aberto' : ''}`}>
            <span className="status__ponto" aria-hidden="true" />
            {status.texto}
          </p>
        </div>
      </div>
    </section>
  )
}

function Rodape() {
  return (
    <footer className="rodape">
      <div className="secao__in rodape__in">
        <p>Dakura Motos LTDA, CNPJ {loja.cnpj}</p>
        <p className="rodape__links">
          <a href={loja.instagram} target="_blank" rel="noopener">Instagram</a>
          <a href={loja.facebook} target="_blank" rel="noopener">Facebook</a>
        </p>
      </div>
    </footer>
  )
}

function BarraCelular() {
  return (
    <div className="barra">
      <a href={loja.telefoneLink} className="barra__ligar">Ligar</a>
      <a href={linkWhats('Olá! Vim pelo site da Dakura Motos.')} target="_blank" rel="noopener" className="barra__zap">WhatsApp</a>
    </div>
  )
}

export default function App() {
  const status = useStatus()
  return (
    <>
      <Cabecalho />
      <main>
        <Abertura status={status} />
        <Faixa />
        <Servicos />
        <Pedido />
        <Historia />
        <Duvidas />
        <Contato status={status} />
      </main>
      <Rodape />
      <BarraCelular />
    </>
  )
}
