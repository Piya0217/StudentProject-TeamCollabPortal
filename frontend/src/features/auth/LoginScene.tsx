import { useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

function GlassPanel({ position, rotation, color }: { position: [number,number,number]; rotation: [number,number,number]; color: string }) {
  return <Float speed={0.7} rotationIntensity={0.12} floatIntensity={0.18}>
    <RoundedBox args={[1.8, 1.18, 0.07]} radius={0.08} smoothness={4} position={position} rotation={rotation}>
      <meshPhysicalMaterial color={color} metalness={0.12} roughness={0.16} transmission={0.35} thickness={0.4} transparent opacity={0.82} />
    </RoundedBox>
  </Float>
}
function Scene() {
  const group = useRef<THREE.Group>(null)
  useFrame((state, delta) => { if (group.current) { group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, state.pointer.x * 0.14, 3, delta); group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -state.pointer.y * 0.08, 3, delta) } })
  return <group ref={group}>
    <ambientLight intensity={1.6} /><directionalLight position={[3,4,5]} intensity={3} /><pointLight position={[-3,-2,2]} color="#2997FF" intensity={8} />
    <GlassPanel position={[-0.7,0.62,-0.5]} rotation={[0.05,0.12,-0.12]} color="#D9E9FA" />
    <GlassPanel position={[0.68,0.24,-0.1]} rotation={[-0.06,-0.08,0.1]} color="#B7D6F7" />
    <GlassPanel position={[-0.52,-0.6,0.3]} rotation={[0.04,0.07,0.08]} color="#E6EAF2" />
    <GlassPanel position={[0.62,-0.58,0.65]} rotation={[-0.04,-0.1,-0.08]} color="#A7CBF4" />
  </group>
}
export default function LoginScene() {
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const lowPower = typeof navigator !== 'undefined' && (navigator.hardwareConcurrency || 8) <= 4
  const hidden = useRef(false)
  useEffect(() => { const onVisibility = () => { hidden.current = document.hidden }; document.addEventListener('visibilitychange', onVisibility); return () => document.removeEventListener('visibilitychange', onVisibility) }, [])
  if (reduced || lowPower || !WebGLRenderingContextAvailable()) return <div className="scene-poster" aria-label="Four translucent project panels arranged in depth"><div>Project</div><div>Team</div><div>Tasks</div><div>Review</div></div>
  return <div className="scene-wrap"><Canvas dpr={[1,2]} camera={{ position: [0,0,5], fov: 42 }} gl={{ alpha: true, antialias: true }}><Scene /></Canvas></div>
}
function WebGLRenderingContextAvailable() { try { const canvas = document.createElement('canvas'); return !canvas.getContext('webgl') && !canvas.getContext('experimental-webgl') } catch { return true } }