import bpy, math, sys, json
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
bpy.ops.wm.open_mainfile(filepath=str(ROOT/'source/soft-lotus-editable.blend'))
scene=bpy.context.scene
petals=[o for o in scene.objects if o.name.startswith('Petal_')]
assert len(petals)==5, [o.name for o in petals]
for o in petals:
    o.data.shape_keys.key_blocks['Bloom'].value=1
    if 'Focus' in o.data.shape_keys.key_blocks: o.data.shape_keys.key_blocks['Focus'].value=0
for o in scene.objects:
    if o.name.startswith('Decor_'):o.hide_render=True
scene.render.engine='CYCLES';scene.cycles.samples=64;scene.cycles.use_denoising=True
scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGB'
scene.view_settings.view_transform='AgX'
scene.render.resolution_percentage=100
scene.render.film_transparent=False
cam=scene.camera
cam.data.type='ORTHO'
floor=next(o for o in scene.objects if o.name=='Proof floor')
def linear(v):return v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4
def color(h):return tuple(linear(int(h[i:i+2],16)/255) for i in (0,2,4))
def point(obj,loc,target):
    obj.location=loc;obj.rotation_euler=(Vector(target)-obj.location).to_track_quat('-Z','Y').to_euler()
for o in list(scene.objects):
    if o.type=='LIGHT':bpy.data.objects.remove(o,do_unlink=True)
for name,loc,power,size in [('Softbox',(-4,-5,8),900,7),('Cool fill',(5,-2,6),450,6),('Rim',(1,5,7),650,5)]:
    d=bpy.data.lights.new(name,'AREA');d.energy=power;d.shape='DISK';d.size=size
    o=bpy.data.objects.new(name,d);scene.collection.objects.link(o);point(o,loc,(0,0,.8))
scene.world.node_tree.nodes.get('Background').inputs['Color'].default_value=(.68,.76,.84,1)
scene.world.node_tree.nodes.get('Background').inputs['Strength'].default_value=.35
fonts={n:bpy.data.fonts.load(str(ROOT/'source'/f'{n}.ttf')) for n in ['Manrope','CormorantGaramond']}
labels=[]
def text(body,x,y,size,font,hexcode):
    curve=bpy.data.curves.new('Masthead typography','FONT');curve.body=body;curve.font=fonts[font];curve.size=1;curve.space_line=1.02
    o=bpy.data.objects.new(body,curve);scene.collection.objects.link(o)
    right=cam.rotation_euler.to_quaternion()@Vector((1,0,0));up=cam.rotation_euler.to_quaternion()@Vector((0,1,0));forward=cam.rotation_euler.to_quaternion()@Vector((0,0,-1))
    unit=cam.data.ortho_scale/scene.render.resolution_x
    o.location=cam.location+forward*4+right*((x-scene.render.resolution_x/2)*unit)+up*((scene.render.resolution_y/2-y)*unit)
    o.rotation_euler=cam.rotation_euler;o.scale=(size*unit,)*3
    mat=bpy.data.materials.new('Typography '+hexcode);mat.use_nodes=True
    nodes=mat.node_tree.nodes;nodes.clear();em=nodes.new('ShaderNodeEmission');em.inputs['Color'].default_value=(*color(hexcode),1);out=nodes.new('ShaderNodeOutputMaterial');mat.node_tree.links.new(em.outputs[0],out.inputs[0]);curve.materials.append(mat)
    labels.append(o)
def stage(dark):
    h='171F29' if dark else 'E5EBED'
    floor.data.materials[0].node_tree.nodes.get('Principled BSDF').inputs['Base Color'].default_value=(*color(h),1)
def cover(dark):
    scene.render.resolution_x=1600;scene.render.resolution_y=680
    cam.data.ortho_scale=15.5;point(cam,(-3.65,-11,9.4),(-3.65,0,1))
    stage(dark)
    text('Beibars Ileskhan',80,232,64,'Manrope','F2F0E9' if dark else '303C43')
    text('Ideas bloom into\nuseful tools',80,368,94,'CormorantGaramond','F2F0E9' if dark else '303C43')
    scene.render.filepath=str(ROOT/'assets'/('lotus-cover-dark.png' if dark else 'lotus-cover-light.png'))
    bpy.ops.render.render(write_still=True)
    for o in labels:bpy.data.objects.remove(o,do_unlink=True)
    labels.clear()
if '--avatar-only' not in sys.argv:cover(False);cover(True)
scene.render.resolution_x=1024;scene.render.resolution_y=1024
cam.data.ortho_scale=7.3;point(cam,(0,-9.5,10.8),(0,0,.8));stage(True)
floor.data.materials[0].node_tree.nodes.get('Principled BSDF').inputs['Base Color'].default_value=(*color('536575'),1)
scene.render.filepath=str(ROOT/'assets/lotus-avatar.png');bpy.ops.render.render(write_still=True)
(ROOT/'docs/render-audit.json').write_text(json.dumps({'source':'seoshiro.github.io/art/soft-lotus/soft-lotus-editable.blend','petals':[o.name for o in petals],'bloom':1,'samples':64,'engine':'Cycles','cost':0,'new_generation':False},indent=2))

