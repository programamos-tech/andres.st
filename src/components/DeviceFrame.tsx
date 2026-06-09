type DeviceFrameProps = {
  children: React.ReactNode;
  className?: string;
};

/** Marco tipo tablet/iPad para vitrina de proyectos */
export function DeviceFrame({ children, className = '' }: DeviceFrameProps) {
  return (
    <div className={`device-frame ${className}`}>
      <div className="device-frame-screen">{children}</div>
    </div>
  );
}
