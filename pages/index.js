import Head from 'next/head'
import { useState, useEffect } from 'react'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [mensaje, setMensaje] = useState('')
  useEffect(() => {
    const now = new Date()
    document.getElementById('fecha').value = now.toLocaleDateString('es-VE') + ' ' + now.toLocaleTimeString('es-VE')
  }, [])

  function calcularTotales() {
    const cantidad = parseFloat(document.getElementById('cantidad').value) || 0
    const precio = parseFloat(document.getElementById('precio_unitario').value) || 0
    const p1 = parseFloat(document.getElementById('monto_pago_1').value) || 0
    const p2 = parseFloat(document.getElementById('monto_pago_2').value) || 0
    const total = cantidad * precio
    const abono = p1 + p2
    document.getElementById('total_usd').value = total.toFixed(2)
    document.getElementById('abono_usd').value = abono.toFixed(2)
    document.getElementById('restante_usd').value = Math.max(0, total - abono).toFixed(2)
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(e.target).entries())
    if ((datos.monto_pago_1 && !datos.metodo_pago_1) || (datos.metodo_pago_1 === 'BS' && !datos.tasa_bcv)) {
      setMensaje('Por favor completa métodos de pago')
      return
    }
    try {
      const res = await fetch('/api/registerSale', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(datos)
      })
      const json = await res.json()
      if (res.ok) {
        setMensaje('✅ Venta registrada correctamente.')
        e.target.reset()
      } else {
        setMensaje('❌ ' + (json.message || 'Error al registrar'))
      }
    } catch (err) {
      setMensaje('❌ Error de conexión')
      console.error(err)
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>NEXT Ventas</title>
      </Head>
      <main className={styles.main}>
        <img src="/logo.png" alt="NEXT Logo" className={styles.logo} />
        <h1>Registrar Venta</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input type="hidden" name="fecha" id="fecha" />
          <input name="cliente" type="text" placeholder="Cliente" required />
          <input name="telefono" type="text" placeholder="Teléfono" required />
          <input name="producto" type="text" placeholder="Producto" required />
          <input name="cantidad" id="cantidad" type="number" placeholder="Cantidad" required onInput={calcularTotales}/>
          <input name="precio_unitario" id="precio_unitario" type="number" placeholder="Precio Unitario" required onInput={calcularTotales}/>
          <input name="total_usd" id="total_usd" type="text" placeholder="Total USD" readOnly />
          <select name="metodo_pago_1" id="metodo_pago_1" required>
            <option value="">Método de Pago 1</option>
            <option value="BS">Bolívares (BS)</option>
            <option value="ZELLE">Zelle</option>
            <option value="EFECTIVO">Efectivo</option>
            <option value="PAGO MOVIL">Pago Móvil</option>
            <option value="TRANSFERENCIA">Transferencia</option>
          </select>
          <input name="monto_pago_1" id="monto_pago_1" type="number" placeholder="Monto Pago 1" required onInput={calcularTotales}/>
          <select name="metodo_pago_2" id="metodo_pago_2">
            <option value="">Método de Pago 2 (opcional)</option>
            <option value="BS">Bolívares (BS)</option>
            <option value="ZELLE">Zelle</option>
            <option value="EFECTIVO">Efectivo</option>
            <option value="PAGO MOVIL">Pago Móvil</option>
            <option value="TRANSFERENCIA">Transferencia</option>
          </select>
          <input name="monto_pago_2" id="monto_pago_2" type="number" placeholder="Monto Pago 2 (opcional)" onInput={calcularTotales}/>
          <input name="tasa_bcv" id="tasa_bcv" type="number" placeholder="Tasa BCV (si aplica BS)" />
          <input name="abono_usd" id="abono_usd" type="text" placeholder="Abono USD" readOnly />
          <input name="restante_usd" id="restante_usd" type="text" placeholder="Restante USD" readOnly />
          <input name="asesor" type="text" placeholder="Asesor" />
          <textarea name="comentario" placeholder="Comentario"></textarea>
          <button type="submit">Registrar</button>
        </form>
        {mensaje && <p className={styles.message}>{mensaje}</p>}
      </main>
    </div>
  )
}
