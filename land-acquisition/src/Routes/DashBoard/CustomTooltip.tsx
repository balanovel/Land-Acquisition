const CustomizeTooltip: React.FC<{
    task: task
    fontSize: string
    fontFamily: string
}> = ({ task, fontSize, fontFamily }) => {
    const style = {

    }
    return (
        <Box className={TooltipStyle.tooltipDefaultContainer} style={style}>
            {task.id}
        </Box>
    )
}